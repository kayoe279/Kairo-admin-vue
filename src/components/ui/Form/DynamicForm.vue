<script setup lang="ts">
import type { FormInst, FormItemRule, FormRules, SelectOption } from "naive-ui";
import { computed, reactive, ref } from "vue";

// 表单项配置接口
interface FormItemConfig {
  path: string;
  label: string;
  type: "input" | "number" | "select" | "date" | "switch" | "radio" | "checkbox" | "textarea";
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  options?: SelectOption[];
  rule?: FormItemRule | FormItemRule[];
  showFeedback?: boolean;
  labelWidth?: string | number;
  labelPlacement?: "left" | "top";

  // 数字输入框特定属性
  min?: number;
  max?: number;
  step?: number;

  // 日期选择器特定属性
  dateType?: "date" | "datetime" | "daterange" | "datetimerange";

  // 文本域特定属性
  rows?: number;
  autosize?: boolean;
}

// Props 定义
interface Props {
  modelValue: Record<string, any>;
  formItems: FormItemConfig[];
  rules?: FormRules;
  labelPlacement?: "left" | "top";
  labelWidth?: string | number;
  size?: "small" | "medium" | "large";
  loading?: boolean;
  showActions?: boolean;
  showReset?: boolean;
  submitText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  labelPlacement: "top",
  labelWidth: "auto",
  size: "medium",
  loading: false,
  showActions: true,
  showReset: true,
  submitText: "提交"
});

// Emits 定义
const emit = defineEmits<{
  "update:modelValue": [value: Record<string, any>];
  submit: [data: Record<string, any>];
  reset: [];
}>();

// 表单引用
const formRef = ref<FormInst>();

// 表单数据
const formData = reactive({ ...props.modelValue });

// 表单规则
const formRules = computed(() => {
  const rules: FormRules = { ...props.rules };

  // 从表单项配置中提取规则
  props.formItems.forEach((item) => {
    if (item.rule) {
      rules[item.path] = item.rule;
    }
  });

  return rules;
});

// 设置字段值
const setFieldValue = (path: string, value: any) => {
  formData[path] = value;
  emit("update:modelValue", formData);
};

// 提交处理
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    emit("submit", formData);
  } catch (error) {
    console.warn("表单验证失败:", error);
  }
};

// 重置处理
const handleReset = () => {
  formRef.value?.restoreValidation();
  Object.keys(formData).forEach((key) => {
    formData[key] = undefined;
  });
  emit("update:modelValue", formData);
  emit("reset");
};

// 暴露表单方法
defineExpose({
  validate: () => formRef.value?.validate(),
  restoreValidation: () => formRef.value?.restoreValidation(),
  getFormData: () => formData
});
</script>

<template>
  <NForm
    ref="formRef"
    :model="formData"
    :rules="formRules"
    :label-placement="labelPlacement"
    :label-width="labelWidth"
    :size="size"
  >
    <NFormItem
      v-for="item in formItems"
      :key="item.path"
      :path="item.path"
      :label="item.label"
      :rule="item.rule"
      :show-feedback="item.showFeedback"
      :label-width="item.labelWidth"
      :label-placement="item.labelPlacement"
    >
      <!-- 输入框 -->
      <NInput
        v-if="item.type === 'input'"
        v-model:value="formData[item.path]"
        :placeholder="item.placeholder"
        :disabled="item.disabled"
        :readonly="item.readonly"
        :clearable="item.clearable"
        @update:value="setFieldValue(item.path, $event)"
      />

      <!-- 数字输入框 -->
      <NInputNumber
        v-else-if="item.type === 'number'"
        v-model:value="formData[item.path]"
        :placeholder="item.placeholder"
        :disabled="item.disabled"
        :readonly="item.readonly"
        :clearable="item.clearable"
        :min="item.min"
        :max="item.max"
        :step="item.step"
        @update:value="setFieldValue(item.path, $event)"
      />

      <!-- 选择器 -->
      <NSelect
        v-else-if="item.type === 'select'"
        v-model:value="formData[item.path]"
        :placeholder="item.placeholder"
        :disabled="item.disabled"
        :clearable="item.clearable"
        :multiple="item.multiple"
        :options="item.options"
        @update:value="setFieldValue(item.path, $event)"
      />

      <!-- 日期选择器 -->
      <NDatePicker
        v-else-if="item.type === 'date'"
        v-model:value="formData[item.path]"
        :placeholder="item.placeholder"
        :disabled="item.disabled"
        :clearable="item.clearable"
        :type="item.dateType || 'date'"
        @update:value="setFieldValue(item.path, $event)"
      />

      <!-- 开关 -->
      <NSwitch
        v-else-if="item.type === 'switch'"
        v-model:value="formData[item.path]"
        :disabled="item.disabled"
        @update:value="setFieldValue(item.path, $event)"
      />

      <!-- 单选组 -->
      <NRadioGroup
        v-else-if="item.type === 'radio'"
        v-model:value="formData[item.path]"
        :disabled="item.disabled"
        @update:value="setFieldValue(item.path, $event)"
      >
        <NRadio
          v-for="option in item.options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </NRadio>
      </NRadioGroup>

      <!-- 多选组 -->
      <NCheckboxGroup
        v-else-if="item.type === 'checkbox'"
        v-model:value="formData[item.path]"
        :disabled="item.disabled"
        @update:value="setFieldValue(item.path, $event)"
      >
        <NCheckbox
          v-for="option in item.options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </NCheckbox>
      </NCheckboxGroup>

      <!-- 文本域 -->
      <NInput
        v-else-if="item.type === 'textarea'"
        v-model:value="formData[item.path]"
        type="textarea"
        :placeholder="item.placeholder"
        :disabled="item.disabled"
        :readonly="item.readonly"
        :rows="item.rows || 3"
        :autosize="item.autosize"
        @update:value="setFieldValue(item.path, $event)"
      />
    </NFormItem>

    <NFormItem v-if="showActions">
      <NSpace>
        <NButton type="primary" :loading="loading" @click="handleSubmit">
          {{ submitText }}
        </NButton>
        <NButton v-if="showReset" @click="handleReset"> 重置 </NButton>
      </NSpace>
    </NFormItem>
  </NForm>
</template>
