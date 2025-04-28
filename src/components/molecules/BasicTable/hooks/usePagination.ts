import { DEFAULT_PAGE_SIZE, PAGE_NAME, PAGE_SIZE_OPTIONS } from "@/lib/constants";
import { useRouteQuery } from "@vueuse/router";
import { PaginationProps } from "naive-ui";
import { computed } from "vue";

export const usePagination = (
  paginationInfo: PaginationProps & { queryPrefix?: string; total?: number }
) => {
  const { queryPrefix, total, ...rest } = paginationInfo;

  const page = useRouteQuery(queryPrefix ? `${queryPrefix}_${PAGE_NAME}` : PAGE_NAME, 1);

  const pageCount = computed(() => {
    if (!total) return 1;
    return Math.ceil(total / (rest.pageSize || DEFAULT_PAGE_SIZE)) || rest.pageCount;
  });

  const itemCount = computed(() => {
    if (!total) return 1;
    return total || rest.itemCount || 1;
  });

  const pagination = computed<PaginationProps>(() => ({
    ...rest,
    page: page.value || rest.page || 1,
    pageSize: rest.pageSize || DEFAULT_PAGE_SIZE,
    pageCount: pageCount.value,
    itemCount: itemCount.value,
    pageSizes: rest.pageSizes || PAGE_SIZE_OPTIONS,
    showSizePicker: rest.showSizePicker ?? true,
    prefix: rest.prefix || (({ itemCount }) => `共${itemCount}条`)
  }));

  return {
    pagination
  };
};
