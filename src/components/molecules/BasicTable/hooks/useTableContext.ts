import type { DataTableInst } from "naive-ui";
import type { BasicTableProps, TableActionType } from "../props";
import type { ComputedRef, Ref } from "vue";
import { inject, provide } from "vue";

const key = Symbol("basic-table");

type Instance = TableActionType & {
  tableRef: Ref<DataTableInst | null>;
  tableProps: ComputedRef<Record<string, any>>;
};

type RetInstance = Omit<Instance, "tableProps"> & {
  tableProps: ComputedRef<BasicTableProps>;
};

export function createTableContext(instance: Instance) {
  provide(key, instance);
}

export function useTableContext(): RetInstance {
  return inject(key) as RetInstance;
}
