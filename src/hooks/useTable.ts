import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS, cleanObject } from "@/lib";
import type { UseTableOptions } from "@/types/table";
import { useWatcher } from "alova/client";
import type { PaginationInfo, PaginationProps } from "naive-ui";
import { computed, reactive, ref, watch } from "vue";

export function useTable<T = any>(
  apiFunction: (params: Record<string, any>) => any,
  options: UseTableOptions
) {
  const {
    defaultPageSize = DEFAULT_PAGE_SIZE,
    pageSizes = PAGE_SIZE_OPTIONS,
    immediate = true
  } = options.value;

  const filters = ref<Record<string, any>>({});

  // 分页配置
  const pagination = reactive<PaginationProps>({
    page: 1,
    pageSize: defaultPageSize,
    pageSizes,
    pageCount: 1,
    itemCount: 0,
    showSizePicker: true,
    showQuickJumper: true,
    prefix: ({ itemCount }: PaginationInfo) => `共 ${itemCount || 0} 条`
  });

  // 请求参数计算属性
  const requestParams = computed(() => ({
    page: pagination.page,
    pageSize: pagination.pageSize,
    ...cleanObject(filters.value)
  }));

  // 使用 alova useWatcher 监听参数变化并自动发送请求
  const { loading, data, send, onSuccess } = useWatcher(
    () => apiFunction(requestParams.value),
    [requestParams],
    {
      immediate,
      debounce: 300
    }
  );

  const tableData = computed(() => data.value?.data?.list || []);

  onSuccess((response) => {
    const result = response?.data?.data;
    if (result) {
      const itemCount = result.total || 0;
      const page = result.page || pagination.page;
      const pageSize = result.pageSize || pagination.pageSize;
      const pageCount = Math.ceil(itemCount / (pageSize || defaultPageSize));
      pagination.itemCount = itemCount;
      pagination.page = page;
      pagination.pageSize = pageSize;
      pagination.pageCount = pageCount;
    }
  });

  // 手动刷新数据
  const refresh = (params?: Record<string, any>) => {
    pagination.page = 1;
    filters.value = { ...filters.value, ...params };
  };

  const handlePageChange = (page: number) => {
    pagination.page = page;
  };

  const handlePageSizeChange = (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1; // 重置到第一页
  };

  watch(
    () => options.value.searchParams,
    (value) => {
      if (value) {
        filters.value = { ...value };
      }
    },
    {
      deep: true,
      immediate: true
    }
  );

  return {
    tableData,
    loading,
    pagination,
    refresh,
    handlePageChange,
    handlePageSizeChange
  };
}
