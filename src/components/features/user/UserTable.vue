<template>
  <n-card :bordered="false">
    <NewTable
      title="用户列表"
      titleTooltip="这是一个提示"
      :data="userList"
      :columns="columns"
      :pagination="pagination"
      :loading="loading"
      @update:page="(page) => updatePagination({ page })"
      @update-page-size="(pageSize) => updatePagination({ pageSize })"
    />
  </n-card>
</template>

<script lang="ts" setup>
import { columns } from "./table/column";
import { useDataTable } from "@/components/molecules/BasicTable/hooks/useDataTable";
import { getTableList } from "@/service/api/table/list";
import { getUserList } from "@/service/api/users";
import { DeleteOutlined, EditOutlined } from "@vicons/antd";
import { useRequest, useWatcher } from "alova/client";
import { useDialog, useMessage } from "naive-ui";
import { computed, ref, watch } from "vue";

// const message = useMessage();
// const dialog = useDialog();
// const actionRef = ref();

// const params = reactive({
//   pageSize: 5,
//   name: "NaiveAdmin"
// });

// const actionColumn = reactive({
//   width: 180,
//   title: "操作",
//   key: "action",
//   fixed: "right",
//   align: "center",
//   render(record) {
//     return h(TableAction as any, {
//       style: "button",
//       actions: createActions(record)
//     });
//   }
// });

const { loading, data, send: refresh } = useRequest(getUserList);

const userList = computed(() => data.value?.data?.list || []);
const total = computed(() => data.value?.data?.total || 0);

const { pagination, updatePagination } = useDataTable({
  total
});

watch([() => pagination.value.page, () => pagination.value.pageSize], async ([page, pageSize]) => {
  await refresh({ page, pageSize });
});

// function createActions(record) {
//   return [
//     {
//       label: "删除",
//       // 配置 color 会覆盖 type
//       icon: DeleteOutlined,
//       onClick: handleDelete.bind(null, record),
//       // 根据权限控制是否显示: 有权限，会显示，支持多个
//       auth: ["basic_list"]
//     },
//     {
//       label: "编辑",
//       icon: EditOutlined,
//       onClick: handleEdit.bind(null, record),
//       auth: ["basic_list"]
//     }
//   ];
// }

// const loadDataTable = async (res) => {
//   return await getTableList({ ...params, ...res });
// };

// function onCheckedRow(rowKeys) {
//   console.log(rowKeys);
// }

// function handleDelete(record) {
//   console.log(record);
//   dialog.info({
//     title: "提示",
//     content: `您想删除${record.name}`,
//     positiveText: "确定",
//     negativeText: "取消",
//     onPositiveClick: () => {
//       message.success("删除成功");
//     },
//     onNegativeClick: () => {}
//   });
// }

// function handleEdit(record) {
//   console.log(record);
//   message.success("您点击了编辑按钮");
// }
</script>
