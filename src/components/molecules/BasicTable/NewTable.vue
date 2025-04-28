<template>
  <n-data-table
    ref="tableRef"
    v-bind="props"
    remote
    :pagination="pagination"
    :columns="props.columns"
    bordered
  />
</template>

<script lang="ts" setup>
import { usePagination } from "./hooks/usePagination";
import type { BasicTableProps } from "./props";
import type { DataTableInst } from "naive-ui";
import { ref } from "vue";

const props = withDefaults(defineProps<BasicTableProps>(), {});

const tableRef = ref<DataTableInst | null>(null);

const { pagination } = usePagination({
  total: props.total,
  ...props.pagination
});

// const pagination = computed(() => {
//   return {
//     ...props.pagination,
//     prefix: ({ itemCount }) => {
//       return `共${itemCount}条`;
//     }
//   };
// });
</script>
