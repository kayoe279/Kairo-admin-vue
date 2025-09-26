import { useSearchQuery } from "../useSearchQuery";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/lib";
import type { DataTableProps, PaginationInfo, PaginationProps } from "naive-ui";
import { MaybeRef, type Ref, computed, reactive, ref, unref, watch } from "vue";

export type TableRef = Ref<HTMLElement | null>;

export interface TableParams {
  pagination?: PaginationProps;
  sortField?: string;
  sortOrder?: "asc" | "desc" | null;
  filters?: Record<string, any>;
}

export type UseTableOptions<T = any> = {
  data: MaybeRef<T[] | undefined>;
  total?: MaybeRef<number>;
  isLoading?: MaybeRef<boolean>;
  searchParams?: MaybeRef<Record<string, any>>;
  onParamsChange?: (params: {
    page: number;
    pageSize: number;
    sortField?: string;
    sortOrder?: string;
  }) => void;
};

export const useTable = <T extends Record<string, any>>(
  options: UseTableOptions<T>,
  tableOptions: Partial<DataTableProps> = {}
) => {
  const { total, data, isLoading } = options;
  const { searchQuery, setSearchQuery } = useSearchQuery();

  const tableRef: TableRef = ref(null);
  const tableData = ref<T[]>(unref(data) || []);

  const pagination = reactive<PaginationProps>({
    page: searchQuery.value.page || DEFAULT_PAGE,
    pageSize: searchQuery.value.pageSize || DEFAULT_PAGE_SIZE,
    pageSizes: PAGE_SIZE_OPTIONS,
    pageCount: 1,
    itemCount: 0,
    showSizePicker: true,
    showQuickJumper: true,
    prefix: ({ itemCount }: PaginationInfo) => `共 ${itemCount || 0} 条`
  });

  const handlePageChange = (page: number) => {
    pagination.page = page;
    setSearchQuery({
      page: pagination.page
    });
  };

  const handlePageSizeChange = (pageSize: number) => {
    pagination.page = 1; // 重置到第一页
    pagination.pageSize = pageSize;

    setSearchQuery({
      page: pagination.page,
      pageSize: pagination.pageSize
    });
  };

  const handleSorterChange = (sorter: any) => {
    pagination.page = 1;
    setSearchQuery({
      page: pagination.page,
      sortField: sorter?.columnKey,
      sortOrder: sorter?.order
    });
  };

  // 监听数据变化
  watch(
    () => [unref(data), unref(isLoading), unref(total)],
    ([newData, loading, newTotal]) => {
      if (!loading) {
        tableData.value = (newData as T[]) || [];
        const itemCount = (newTotal as number) || 0;
        pagination.itemCount = itemCount;
        pagination.page = searchQuery.value.page || pagination.page;
        pagination.pageSize = searchQuery.value.pageSize || pagination.pageSize;
      }
    },
    { deep: true, immediate: true }
  );

  const tableProps = computed(() => {
    const props = {
      remote: true,
      loading: unref(isLoading),
      data: tableData.value,
      pagination: pagination,
      size: "medium" as const,
      bordered: true,
      striped: true,
      onUpdateSorter: handleSorterChange,
      rowKey: (record: T) => record.id,
      onUpdatePage: handlePageChange,
      onUpdatePageSize: handlePageSizeChange
    } as DataTableProps;

    return Object.assign(props, tableOptions);
  });

  return {
    tableRef,
    tableProps
  };
};
