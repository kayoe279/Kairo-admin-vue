<script setup lang="ts">
import SvgIcon from "@/components/ui/SvgIcon.vue";
import { cleanObject, cn } from "@/lib";
import cloneDeep from "lodash-es/cloneDeep";
import { ref } from "vue";

// Props 定义
interface Props {
  /** 是否加载中 */
  loading?: boolean;
  /** 是否显示重置按钮 */
  showReset?: boolean;
  /** 是否显示搜索按钮 */
  showSearch?: boolean;
  /** 是否内联显示 */
  inline?: boolean;
  /** 是否可折叠 */
  collapsible?: boolean;
  /** 初始折叠状态 */
  collapsed?: boolean;
  /** 标签宽度 */
  labelWidth?: string;
  /** 搜索按钮文本 */
  searchText?: string;
  /** 重置按钮文本 */
  resetText?: string;
  /** 展开按钮文本 */
  expandText?: string;
  /** 收起按钮文本 */
  collapseText?: string;
  /** 默认值，重置时恢复到此值 */
  defaultValues?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
  loading: false,
  showReset: true,
  showSearch: true,
  inline: false,
  collapsible: false,
  collapsed: false,
  labelWidth: "80px",
  searchText: "搜索",
  resetText: "重置",
  expandText: "展开",
  collapseText: "收起",
  defaultValues: () => ({})
});

const searchFormData = defineModel<Record<string, any>>({ required: true });

// Emits 定义
const emit = defineEmits<{
  "update:collapsed": [value: boolean];
  search: [value: Record<string, any> | undefined];
  reset: [];
}>();

// 表单引用
const formRef = ref();

// 折叠状态
const collapsed = ref(props.collapsed);

const resetFormData = () => {
  for (const key in searchFormData.value) {
    searchFormData.value[key] = null;
  }
  searchFormData.value = cloneDeep(searchFormData.value);
};

// 搜索处理
const handleSearch = () => {
  emit("search", cleanObject(searchFormData.value));
};

// 重置处理
const handleReset = () => {
  // 清除表单验证状态
  formRef.value?.restoreValidation();
  resetFormData();
  emit("reset");
};

// 切换折叠状态
const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
  emit("update:collapsed", collapsed.value);
};

// 暴露方法给父组件
defineExpose({
  formRef,
  resetFormData
});
</script>

<template>
  <NForm ref="formRef" :model="searchFormData" :inline="inline" :label-width="labelWidth">
    <NGrid :cols="inline ? 'auto' : 24" :x-gap="16" :y-gap="10">
      <!-- 默认显示的表单项 -->
      <slot name="fields" :collapsed="collapsed" />

      <!-- 可折叠的表单项 -->
      <template v-if="collapsible && !collapsed">
        <slot name="expandedFields" />
      </template>

      <!-- 操作按钮区域 -->
      <NGridItem :span="24">
        <NSpace justify="end">
          <!-- 自定义按钮插槽 -->
          <slot name="actions" :search="handleSearch" :reset="handleReset">
            <!-- 默认按钮 -->
            <NButton v-if="showSearch" type="primary" :loading="loading" @click="handleSearch">
              <template #icon>
                <SvgIcon icon="weui:search-outlined" />
              </template>
              {{ searchText }}
            </NButton>
            <NButton v-if="showReset" @click="handleReset">
              <template #icon>
                <SvgIcon icon="radix-icons:reset" />
              </template>
              {{ resetText }}
            </NButton>
          </slot>

          <!-- 折叠按钮 -->
          <NButton v-if="collapsible" text type="primary" @click="toggleCollapse">
            {{ collapsed ? expandText : collapseText }}
            <template #icon>
              <SvgIcon
                icon="solar:alt-arrow-up-bold"
                :class="cn('transition-all duration-300', { 'rotate-180': collapsed })"
              />
            </template>
          </NButton>
        </NSpace>
      </NGridItem>
    </NGrid>
  </NForm>
</template>
