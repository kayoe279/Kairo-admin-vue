<script setup lang="ts">
import { FormItemConfig } from "@/components/ui/Form/type";
import { useSearchQuery } from "@/hooks";
import { TableRef, useTable, useTableHeight } from "@/hooks/table";
import { DataTableColumns, NDataTable } from "naive-ui";
import { Ref, ref, toRefs } from "vue";

type Props = {
  columns: DataTableColumns<any>;
  prefix?: string;
  searchQuery?: Record<string, any>;
  filters?: FormItemConfig[];
  data?: any[];
  total?: number;
  isLoading?: boolean;
  withCard?: boolean;
  cardTitle?: string;
};

const props = withDefaults(defineProps<Props>(), {
  prefix: "",
  columns: () => [],
  searchQuery: () => ({}),
  filters: () => [],
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

const { setSearchQuery, resetSearchQuery } = useSearchQuery({ prefix: props.prefix });

const handleSubmit = (values: Record<string, any>) => {
  setSearchQuery(values);
};

const handleReset = () => {
  resetSearchQuery();
};
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col gap-4">
    <template v-if="filters.length > 0">
      <NCard :title="cardTitle">
        <DynamicForm
          :formValues="searchQuery"
          :fields="filters"
          :loading="isLoading"
          @submit="handleSubmit"
          @reset="handleReset"
        />
      </NCard>
    </template>
    <TableContainer :withCard="withCard">
      <div class="space-y-4">
        <div v-if="$slots.headerLeft || $slots.headerRight" class="table-operation">
          <NSpace justify="space-between">
            <slot name="headerLeft" />
            <slot name="headerRight" />
          </NSpace>
        </div>
        <NDataTable
          ref="tableRef"
          :columns="columns"
          v-bind="tableProps"
          :maxHeight="tableHeight"
        />
      </div>
    </TableContainer>
  </div>
</template>
