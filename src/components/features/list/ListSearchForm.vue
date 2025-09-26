<script setup lang="ts">
import { useSearchQuery } from "@/hooks";
import { NFormItem, NInput, NSelect } from "naive-ui";
import { reactive, watch } from "vue";

export interface NavListSearchFormValues {
  keyword?: string;
  disabled?: string;
}

type Props = {
  model?: NavListSearchFormValues;
  loading?: boolean;
};

withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<{
  search: [values: NavListSearchFormValues];
  reset: [];
}>();

// 定义默认搜索值
const defaultSearchValues: NavListSearchFormValues = {
  keyword: "",
  disabled: ""
};

const searchFormData = reactive<NavListSearchFormValues>({ ...defaultSearchValues });

const { allQuery, setSearchQuery } = useSearchQuery();

const statusOptions = [
  { label: "全部", value: "" },
  { label: "启用", value: "false" },
  { label: "禁用", value: "true" }
];

const handleSearch = (values: NavListSearchFormValues) => {
  emit("search", values);
  setSearchQuery(values);
};

const handleReset = () => {
  Object.assign(searchFormData, defaultSearchValues);
  setSearchQuery(defaultSearchValues);
  emit("reset");
};

watch(
  allQuery,
  (newVal) => {
    Object.assign(searchFormData, newVal);
    for (const key of Object.keys(newVal)) {
      searchFormData[key] = newVal[key];
    }
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <NCard title="高级表格示例">
    <SearchForm
      v-model="searchFormData"
      :loading="loading"
      @search="handleSearch"
      @reset="handleReset"
    >
      <template #fields>
        <NGridItem :span="6">
          <NFormItem label="关键词" path="keyword">
            <NInput
              v-model:value="searchFormData.keyword"
              placeholder="请输入关键词"
              clearable
              :disabled="loading"
            />
          </NFormItem>
        </NGridItem>

        <NGridItem :span="6">
          <NFormItem label="状态" path="disabled">
            <NSelect
              v-model:value="searchFormData.disabled"
              placeholder="请选择状态"
              :options="statusOptions"
              :disabled="loading"
            />
          </NFormItem>
        </NGridItem>
      </template>
    </SearchForm>
  </NCard>
</template>
