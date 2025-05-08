import { usePagination } from "./usePagination";
import type { TablePagination } from "./usePagination";
import { Method, RespondedAlovaGenerics } from "alova";
import { AlovaMethodHandler, useWatcher } from "alova/client";
import { PaginationProps } from "naive-ui";
import { ComputedRef, MaybeRef, computed, ref } from "vue";

export function useDataTable({ total, paginationInfo }: TablePagination) {
  const { pagination, updatePagination } = usePagination({
    total,
    paginationInfo
  });

  // 筛选条件
  const filters = ref({});

  // 排序状态
  const sort = ref({});

  // 构建请求参数
  //   const requestParams = computed(() => ({
  //     page: pagination.value?.page,
  //     pageSize: pagination.value?.pageSize,
  //     ...filters.value,
  //     ...sort.value,
  //     ...defaultParams
  //   }));

  // 使用 useWatcher 监听参数变化自动请求
  //   const { data, loading, error, send } = useWatcher(
  //     fetchData(requestParams.value),
  //     [requestParams],
  //     { immediate: true }
  //   );

  // 更新筛选条件
  const updateFilters = (newFilters: Record<string, any>) => {
    filters.value = newFilters;
    updatePagination({ page: 1 }); // 重置页码
  };

  // 更新排序
  const updateSort = (newSort: Record<string, any>) => {
    sort.value = newSort;
  };

  // 刷新数据
  //   const refresh = () => {
  //     send();
  //   };

  return {
    pagination,
    updatePagination
  };
}
