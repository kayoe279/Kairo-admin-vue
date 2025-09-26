<script setup lang="ts">
import { TableRef, useTable, useTableHeight } from "@/hooks/table";
import { DataTableColumns, NDataTable } from "naive-ui";
import { Ref, ref, toRefs } from "vue";

type Props = {
  columns: DataTableColumns<any>;
  searchParams?: Record<string, any>;
  data?: any[];
  total?: number;
  isLoading?: boolean;
  withCard?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  columns: () => [],
  searchParams: () => ({}),
  data: () => [],
  total: 0,
  isLoading: false,
  withCard: true
});

const emit = defineEmits(["update:tableParams"]);

const tableRef: TableRef = ref(null);
const { total, data, isLoading } = toRefs(props);

const { tableProps } = useTable({
  data,
  total,
  isLoading
});

const { tableHeight } = useTableHeight(tableRef as Ref<HTMLElement>);
</script>

<template>
  <TableContainer :withCard="withCard">
    <div class="space-y-4">
      <div v-if="$slots.headerLeft || $slots.headerRight" class="table-operation">
        <NSpace justify="space-between">
          <slot name="headerLeft" />
          <slot name="headerRight" />
        </NSpace>
      </div>
      <NDataTable ref="tableRef" :columns="columns" v-bind="tableProps" :maxHeight="tableHeight" />
    </div>
  </TableContainer>
</template>
