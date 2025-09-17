<script setup lang="ts">
import type { UserSearchFormData } from "@/types";
import { computed, ref } from "vue";

type UserSearchFormProps = {
  modelValue?: Record<string, any>;
  collapsed?: boolean;
};

const props = withDefaults(defineProps<UserSearchFormProps>(), {
  modelValue: () => ({}),
  collapsed: false
});

const emit = defineEmits<{
  "update:collapsed": [value: boolean];
  search: [value: UserSearchFormData];
  reset: [];
}>();

// 搜索表单数据
const searchFormData = ref<UserSearchFormData>({
  keyword: "1233344",
  category: null,
  status: null,
  dateRange: null,
  priceRange: [0, 0],
  tags: []
});

const collapsed = computed({
  get() {
    return props.collapsed;
  },
  set(value) {
    emit("update:collapsed", value);
  }
});

// 处理搜索
const handleSearch = () => {
  emit("search", searchFormData.value);
};

// 处理重置
const handleReset = () => {
  emit("reset");
};
</script>

<template>
  <NCard title="高级表格示例">
    <SearchForm
      v-model="searchFormData"
      v-model:collapsed="collapsed"
      @search="handleSearch"
      @reset="handleReset"
    >
      <template #fields>
        <NGridItem :span="6">
          <NFormItem label="关键词" path="keyword">
            <NInput v-model:value="searchFormData.keyword" placeholder="请输入关键词" clearable />
          </NFormItem>
        </NGridItem>

        <NGridItem :span="6">
          <NFormItem label="分类" path="category">
            <NSelect
              v-model:value="searchFormData.category"
              placeholder="请选择分类"
              clearable
              :options="[
                { label: '技术', value: 'tech' },
                { label: '产品', value: 'product' },
                { label: '设计', value: 'design' },
                { label: '运营', value: 'operation' }
              ]"
            />
          </NFormItem>
        </NGridItem>

        <NGridItem :span="6">
          <NFormItem label="状态" path="status">
            <NSelect
              v-model:value="searchFormData.status"
              placeholder="请选择状态"
              clearable
              :options="[
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
                { label: '待审核', value: 2 }
              ]"
            />
          </NFormItem>
        </NGridItem>
      </template>

      <template #expandedFields>
        <NGridItem :span="6">
          <NFormItem label="日期范围" path="dateRange">
            <NDatePicker
              v-model:value="searchFormData.dateRange"
              type="daterange"
              clearable
              placeholder="选择日期范围"
            />
          </NFormItem>
        </NGridItem>

        <NGridItem :span="12">
          <NFormItem label="标签" path="tags">
            <NSelect
              v-model:value="searchFormData.tags"
              multiple
              placeholder="请选择标签"
              clearable
              :options="[
                { label: 'Vue', value: 'vue' },
                { label: 'React', value: 'react' },
                { label: 'TypeScript', value: 'typescript' },
                { label: 'JavaScript', value: 'javascript' },
                { label: 'Node.js', value: 'nodejs' }
              ]"
            />
          </NFormItem>
        </NGridItem>
      </template>
    </SearchForm>
  </NCard>
</template>
