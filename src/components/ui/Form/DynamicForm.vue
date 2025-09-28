<script setup lang="ts">
import { FormItemConfig } from "./type";
import cloneDeep from "lodash-es/cloneDeep";
import type { FormInst, FormRules } from "naive-ui";
import { computed, ref } from "vue";

interface Props {
  formValues: Record<string, any>;
  fields: FormItemConfig[];
  expandFields?: FormItemConfig[];
  rules?: FormRules;
  labelPlacement?: "left" | "top";
  labelWidth?: string | number;
  size?: "small" | "medium" | "large";
  loading?: boolean;
  showActions?: boolean;
  showReset?: boolean;
  submitText?: string;
  resetText?: string;
  colSize?: number;
  defaultValues?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  formValues: () => ({}),
  labelPlacement: "top",
  labelWidth: "auto",
  size: "medium",
  loading: false,
  showActions: true,
  showReset: true,
  submitText: "提交",
  resetText: "重置",
  colSize: 4,
  defaultValues: () => ({})
});

const formData = defineModel<Record<string, any>>("formValues", { required: true });

// Emits 定义
const emit = defineEmits<{
  submit: [data: Record<string, any>];
  reset: [];
}>();

// 表单引用
const formRef = ref<FormInst>();
const collapsed = ref(false);

const showExpandFields = computed(() => {
  return props.fields.some((item) => item.isExpandField);
});

// 表单规则
const formRules = computed(() => {
  const rules: FormRules = { ...props.rules };

  // 从表单项配置中提取规则
  props.fields.forEach((item) => {
    if (item.rule) {
      rules[item.path] = item.rule;
    }
  });

  return rules;
});

// 设置字段值
const setFieldValue = (path: string, value: any) => {
  formData.value[path] = value;
};

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value;
};

// 提交处理
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    emit("submit", formData.value);
  } catch (error) {
    console.warn("表单验证失败:", error);
  }
};

const resetFormData = () => {
  for (const key in formData.value) {
    formData.value[key] = null;
  }
  formData.value = cloneDeep(formData.value);
};

// 重置处理
const handleReset = () => {
  formRef.value?.restoreValidation();
  resetFormData();

  emit("reset");
};

// 暴露表单方法
defineExpose({
  validate: () => formRef.value?.validate(),
  restoreValidation: () => formRef.value?.restoreValidation(),
  getFormData: () => formData,
  resetFormData
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
    <NGrid :cols="colSize" :x-gap="16">
      <template v-for="item in fields" :key="item.path">
        <NGridItem v-if="!item.isExpandField || (item.isExpandField && collapsed)">
          <NFormItem
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
        </NGridItem>
      </template>
    </NGrid>

    <NGrid v-if="showActions">
      <NGridItem :span="24" class="flex justify-end">
        <NFormItem :showFeedback="false">
          <NSpace>
            <NButton type="primary" :loading="loading" @click="handleSubmit">
              <template #icon>
                <SvgIcon icon="weui:search-outlined" />
              </template>
              {{ submitText }}
            </NButton>
            <NButton v-if="showReset" @click="handleReset">
              <template #icon>
                <SvgIcon icon="radix-icons:reset" />
              </template>
              {{ resetText }}
            </NButton>
            <NButton v-if="showExpandFields" quaternary @click="toggleCollapsed">
              {{ collapsed ? "收起" : "展开" }}
              <SvgIcon
                :icon="collapsed ? 'solar:alt-arrow-up-bold' : 'solar:alt-arrow-down-bold'"
              />
            </NButton>
          </NSpace>
        </NFormItem>
      </NGridItem>
    </NGrid>
  </NForm>
</template>
