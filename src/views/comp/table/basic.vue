<script setup lang="ts">
import { columns } from "./basicColumns";
import SvgIcon from "@/components/atoms/SvgIcon.vue";
import { BasicTable, TableAction } from "@/components/molecules/Table";
import { getUserList } from "@/service/api/auth/users";
import { useDialog, useMessage } from "naive-ui";
import { h, reactive, ref } from "vue";

const message = useMessage();
const dialog = useDialog();
const tableRef = ref();

const actionColumn = reactive({
  width: 180,
  title: "操作",
  key: "action",
  fixed: "right",
  align: "center",
  render(record: any) {
    return h(TableAction as any, {
      style: "button",
      actions: buildTableActions(record)
    });
  }
});

const buildTableActions = (record: any) => [
  {
    label: "删除",
    icon: () => h(SvgIcon, { icon: "ant-design:delete-outlined" }),
    onClick: () => handleDeleteRecord(record),
    auth: ["basic_list"]
  },
  {
    label: "编辑",
    icon: () => h(SvgIcon, { icon: "ant-design:edit-outlined" }),
    onClick: () => handleEditRecord(record),
    auth: ["basic_list"]
  }
];

const onCheckedRowsChange = (rowKeys: string[]) => {
  console.log(rowKeys);
};

const handleDeleteRecord = (record: any) => {
  console.log(record);
  dialog.info({
    title: "提示",
    content: `您想删除${record.name}`,
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      message.success("删除成功");
    }
  });
};

const handleEditRecord = (record: any) => {
  console.log(record);
  message.success("您点击了编辑按钮");
};
</script>

<template>
  <n-card :bordered="false" class="rounded-lg border-0 bg-white shadow-sm">
    <BasicTable
      ref="tableRef"
      title="表格列表"
      titleTooltip="这是一个提示"
      :columns="columns"
      :request="getUserList"
      :row-key="(row) => row.id"
      :actionColumn="actionColumn"
      :scroll-x="1360"
      @update:checked-row-keys="onCheckedRowsChange"
    />
  </n-card>
</template>
