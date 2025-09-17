<script setup lang="ts">
import { getTableList } from "@/service/api/list";
import { type DataTableColumns, NTag } from "naive-ui";
import { h, ref } from "vue";

// 数据类型
interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  createDate: string;
}

// 表格列配置
const columns: DataTableColumns<User> = [
  {
    title: "ID",
    key: "id",
    width: 80
  },
  {
    title: "用户名",
    key: "name",
    width: 120
  },
  {
    title: "邮箱",
    key: "email",
    width: 200
  },
  {
    title: "状态",
    key: "status",
    width: 100,
    render(row) {
      return h(
        NTag,
        {
          type: row.status === "pass" ? "success" : row.status === "refuse" ? "error" : "warning"
        },
        {
          default: () => {
            const statusMap = {
              pass: "通过",
              refuse: "拒绝",
              close: "关闭"
            };
            return statusMap[row.status] || row.status;
          }
        }
      );
    }
  },
  {
    title: "创建时间",
    key: "createDate",
    width: 180
  }
];

// 表格引用
const tableRef = ref();
</script>

<template>
  <div class="flex flex-col gap-4">
    <NCard title="新版基础表格示例（带数据获取）">
      展示基础表格组件的使用方法，包含分页、操作按钮等功能
    </NCard>
    <NCard>
      <BasicTable ref="tableRef" :columns="columns" :api-function="getTableList" />
    </NCard>
  </div>
</template>
