import type { PaginationProps } from "../types/pagination";
import type { BasicTableProps } from "../types/props";
import { componentSetting } from "@/lib/settings/component";
import { isBoolean } from "@/lib/utils";
import { type ComputedRef, computed, ref, unref, watch } from "vue";

export function usePagination(tableProps: ComputedRef<BasicTableProps>) {
  const { defaultPageSize, pageSizes } = componentSetting.table;

  const showPagination = ref(true);
  const paginationConfig = ref<PaginationProps>({
    page: 1,
    pageSize: defaultPageSize
  });

  watch(
    () => unref(tableProps).pagination,
    (pagination) => {
      if (!isBoolean(pagination) && pagination) {
        paginationConfig.value = {
          ...unref(paginationConfig),
          ...(pagination ?? {})
        };
      }
    }
  );

  const pagination = computed((): PaginationProps => {
    const { pagination } = unref(tableProps);
    if (
      !unref(showPagination) ||
      (isBoolean(pagination) && !pagination) ||
      !tableProps.value?.showPagination
    ) {
      return {};
    }

    return {
      page: 1, //当前页
      pageSize: defaultPageSize, //分页大小
      pageSizes: pageSizes, // 每页条数
      showSizePicker: true,
      showQuickJumper: true,
      prefix: ({ itemCount }) => `共 ${itemCount} 条`,
      ...unref(paginationConfig)
    };
  });

  const setPagination = (info: Partial<PaginationProps>) => {
    const paginationInfo = unref(pagination);
    paginationConfig.value = {
      ...(!isBoolean(paginationInfo) ? paginationInfo : {}),
      ...info
    };
  };

  const setShowPagination = (flag: boolean) => {
    showPagination.value = flag;
  };

  return { pagination, setShowPagination, setPagination };
}
