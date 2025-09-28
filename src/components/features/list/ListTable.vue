<script setup lang="ts">
import { createNavListTableColumns } from "./columns";
import { FormItemConfig } from "@/components/ui/Form/type";
import { useSearchQuery } from "@/hooks";
import { cn } from "@/lib";
import { type NavListItem, useTableList } from "@/service";
import { useDialog, useMessage } from "naive-ui";
import { computed, ref, watch } from "vue";

const emit = defineEmits<{
  "update:loading": [value: boolean];
}>();

const dialog = useDialog();
const message = useMessage();

const detailModalVisible = ref(false);
const selectedUser = ref<NavListItem | null>(null);

const { searchQuery } = useSearchQuery({ extendKeys: ["keyword", "disabled"] });
const { data, isFetching, isLoading, refetch } = useTableList(searchQuery);

const filters = ref<FormItemConfig[]>([
  {
    label: "关键词",
    path: "keyword",
    type: "input",
    placeholder: "请输入关键词"
  },
  {
    label: "状态",
    path: "disabled",
    type: "select",
    placeholder: "请选择状态",
    options: [
      { label: "启用", value: "false" },
      { label: "禁用", value: "true" }
    ]
  }
]);

const handleDisable = (record: NavListItem) => {
  dialog.warning({
    title: record.disabled ? "确认启用" : "确认禁用",
    content: `确定要${record.disabled ? "启用" : "禁用"}${record.name}吗？`,
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      message.success(`TODO 还没做: ${record.name}`);
    }
  });
};

const handleEdit = (record: NavListItem) => {
  selectedUser.value = record;
  detailModalVisible.value = true;
};

const handleDelete = (record: NavListItem) => {
  dialog.error({
    title: "确认删除",
    content: `确定要删除${record.name}吗？`,
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      message.success(`TODO 还没做: ${record.name}`);
    }
  });
};

// 创建 columns 配置
const columns = computed(() =>
  createNavListTableColumns({
    showActions: true,
    actions: {
      onEdit: handleEdit,
      onDisable: handleDisable,
      onDelete: handleDelete
    }
  })
);

const handleRefresh = async () => {
  await refetch();
};

watch(isLoading, (newVal) => {
  emit("update:loading", newVal);
});
</script>

<template>
  <BasicTable
    :data="data?.list"
    :total="data?.total"
    :isLoading="isLoading"
    :columns="columns"
    :searchQuery="searchQuery"
    :filters="filters"
  >
    <template #headerLeft>
      <NButton type="primary">
        <template #icon>
          <SvgIcon icon="carbon:add" />
        </template>
        新建
      </NButton>
    </template>
    <template #headerRight>
      <ButtonIcon
        icon="solar:refresh-bold"
        :tooltip-content="$t('common.reload')"
        :class="cn({ 'pointer-events-none animate-spin': isFetching })"
        @click="handleRefresh"
      />
    </template>
  </BasicTable>
</template>
