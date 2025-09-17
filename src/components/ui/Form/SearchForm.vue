<script setup lang="ts">
import SvgIcon from "@/components/ui/SvgIcon.vue";
import type { SearchFormData, SearchFormProps } from "@/types/form";
import { SelectOption } from "naive-ui";
import { reactive, ref, watch } from "vue";

// Props 定义
const props = withDefaults(defineProps<SearchFormProps>(), {
  loading: false,
  showReset: true,
  showSearch: true,
  inline: false,
  collapsible: true,
  collapsed: false,
  labelWidth: "80px"
});

// Emits 定义
const emit = defineEmits<{
  "update:modelValue": [value: SearchFormData];
  "update:collapsed": [value: boolean];
  search: [data: SearchFormData];
  reset: [];
}>();

// 表单引用
const formRef = ref();

// 表单数据
const formData = reactive<SearchFormData>({ ...props.modelValue });

// 折叠状态
const collapsed = ref(props.collapsed);

// 默认选项数据（可通过 props 传入自定义选项）
const defaultCategoryOptions: SelectOption[] = [
  { label: "技术", value: "tech" },
  { label: "产品", value: "product" },
  { label: "设计", value: "design" },
  { label: "运营", value: "operation" }
];

const defaultStatusOptions: SelectOption[] = [
  { label: "启用", value: 1 },
  { label: "禁用", value: 0 },
  { label: "待审核", value: 2 }
];

const defaultTagOptions: SelectOption[] = [
  { label: "Vue", value: "vue" },
  { label: "React", value: "react" },
  { label: "TypeScript", value: "typescript" },
  { label: "JavaScript", value: "javascript" },
  { label: "Node.js", value: "nodejs" }
];

// 监听表单数据变化
watch(
  formData,
  (newValue) => {
    emit("update:modelValue", newValue);
  },
  { deep: true }
);

// 监听外部数据变化
watch(
  () => props.modelValue,
  (newValue) => {
    Object.assign(formData, newValue);
  },
  { deep: true }
);

// 搜索处理
const handleSearch = () => {
  emit("search", formData);
};

// 重置处理
const handleReset = () => {
  Object.keys(formData).forEach((key) => {
    formData[key as keyof SearchFormData] = undefined;
  });
  emit("reset");
  emit("search", formData);
};

// 切换折叠状态
const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
  emit("update:collapsed", collapsed.value);
};
</script>

<template>
  <NForm
    ref="formRef"
    :model="formData"
    :inline="inline"
    :label-width="labelWidth"
    class="search-form"
  >
    <NGrid :cols="inline ? 'auto' : 24" :x-gap="16" :y-gap="10">
      <NGridItem :span="inline ? 'auto' : 6">
        <NFormItem label="关键词" path="keyword">
          <NInput
            v-model:value="formData.keyword"
            placeholder="请输入关键词"
            clearable
            @keydown.enter="handleSearch"
          />
        </NFormItem>
      </NGridItem>

      <NGridItem :span="inline ? 'auto' : 6">
        <NFormItem label="分类" path="category">
          <NSelect
            v-model:value="formData.category"
            placeholder="请选择分类"
            clearable
            :options="defaultCategoryOptions"
          />
        </NFormItem>
      </NGridItem>

      <NGridItem :span="inline ? 'auto' : 6">
        <NFormItem label="状态" path="status">
          <NSelect
            v-model:value="formData.status"
            placeholder="请选择状态"
            clearable
            :options="defaultStatusOptions"
          />
        </NFormItem>
      </NGridItem>

      <NGridItem :span="inline ? 'auto' : 6" v-if="!collapsed">
        <NFormItem label="日期范围" path="dateRange">
          <NDatePicker
            v-model:value="formData.dateRange"
            type="daterange"
            clearable
            placeholder="选择日期范围"
          />
        </NFormItem>
      </NGridItem>

      <NGridItem :span="inline ? 'auto' : 12" v-if="!collapsed">
        <NFormItem label="标签" path="tags">
          <NSelect
            v-model:value="formData.tags"
            multiple
            placeholder="请选择标签"
            clearable
            :options="defaultTagOptions"
          />
        </NFormItem>
      </NGridItem>

      <NGridItem :span="inline ? 'auto' : 24">
        <NSpace justify="end">
          <NButton type="primary" :loading="loading" @click="handleSearch">
            <template #icon>
              <SvgIcon icon="mi:search" />
            </template>
            搜索
          </NButton>
          <NButton v-if="showReset" @click="handleReset">
            <template #icon> <SvgIcon icon="solar:refresh-bold" /> </template>重置
          </NButton>
          <NButton v-if="collapsible" text type="primary" @click="toggleCollapse">
            {{ collapsed ? "展开" : "收起" }}
            <template #icon>
              <SvgIcon
                :icon="collapsed ? 'solar:alt-arrow-down-bold' : 'solar:alt-arrow-up-bold'"
              />
            </template>
          </NButton>
        </NSpace>
      </NGridItem>
    </NGrid>
  </NForm>
</template>
