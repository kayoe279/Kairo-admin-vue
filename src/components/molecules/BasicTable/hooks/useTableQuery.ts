import { DEFAULT_PAGE_SIZE, PAGE_NAME, PAGE_SIZE_NAME } from "@/lib/constants";
import { useRouteQuery } from "@vueuse/router";
import { computed } from "vue";

export const useTableQuery = ({ queryPrefix }: { queryPrefix?: string }) => {
  const pageQuery = computed(() => (queryPrefix ? `${queryPrefix}_${PAGE_NAME}` : PAGE_NAME));
  const pageSizeQuery = computed(() =>
    queryPrefix ? `${queryPrefix}_${PAGE_SIZE_NAME}` : PAGE_SIZE_NAME
  );
  const page = useRouteQuery<number>(pageQuery.value, 1);
  const pageSize = useRouteQuery<number>(pageSizeQuery.value, DEFAULT_PAGE_SIZE);

  const setPaginationQuery = (value: number, pageSizeValue: number) => {
    page.value = Number(value);
    pageSize.value = Number(pageSizeValue);
  };

  const searchParams = computed(() => ({
    page: page.value,
    pageSize: pageSize.value
  }));

  return {
    page,
    pageSize,
    searchParams,
    setPaginationQuery
  };
};
