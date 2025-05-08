import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/lib/constants";
import { PaginationProps as NaivePaginationProps } from "naive-ui";
import { type ComputedRef, ref, unref, watch } from "vue";

export type PaginationProps = NaivePaginationProps & { page: number; pageSize: number };

export type TablePagination = {
  total: ComputedRef<number>;
  paginationInfo?: ComputedRef<PaginationProps>;
};

export const usePagination = ({ total, paginationInfo }: TablePagination) => {
  const pagination = ref<Omit<PaginationProps, "themeOverrides">>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE
  });

  watch([() => paginationInfo, total], () => {
    const info = unref(paginationInfo);

    const pageCount =
      Math.ceil(total.value / (pagination.value.pageSize || DEFAULT_PAGE_SIZE)) || 1;

    pagination.value = {
      ...info,
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      pageCount: pageCount,
      itemCount: total.value,
      pageSizes: info?.pageSizes || PAGE_SIZE_OPTIONS,
      showSizePicker: info?.showSizePicker ?? true,
      showQuickJumper: info?.showQuickJumper ?? true,
      prefix: info?.prefix || (({ itemCount }) => `共${itemCount}条`)
    };
  });

  const updatePagination = ({ page, pageSize }: { page?: number; pageSize?: number }) => {
    if (!pagination.value) return;
    const info = unref(pagination.value);
    const newPage = pageSize ? 1 : page || info?.page || 1;
    const newPageSize = pageSize || info?.pageSize || DEFAULT_PAGE_SIZE;

    pagination.value.page = Number(newPage);
    pagination.value.pageSize = Number(newPageSize);
    pagination.value.pageCount = Math.ceil((info?.itemCount || 1) / newPageSize);
  };

  return {
    pagination,
    updatePagination
  };
};
