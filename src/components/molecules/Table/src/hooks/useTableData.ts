import type { PaginationProps } from "../types/pagination";
import type { BasicTableProps } from "../types/props";
import { componentSetting } from "@/lib/settings/component";
import { AlovaGenerics, Method, RespondedAlovaGenerics } from "alova";
import { useRequest } from "alova/client";
import { FetchRequestInit } from "alova/fetch";
import type { ComputedRef, Ref, WatchSource } from "vue";
import { computed, unref, watch } from "vue";

type TableDataProps = {
  pagination: ComputedRef<PaginationProps>;
  setPagination: (pagination: PaginationProps) => void;
};

type TableRequest<T, R> = (params: R) => Method<
  RespondedAlovaGenerics<
    AlovaGenerics<
      any,
      any,
      FetchRequestInit,
      Response,
      Headers,
      any,
      any,
      {
        name: "Vue";
        State: Ref<unknown, unknown>;
        Computed: ComputedRef<unknown>;
        Watched: object | WatchSource<unknown>;
        StateExport: Ref<unknown, unknown>;
        ComputedExport: ComputedRef<unknown>;
      }
    >,
    T,
    unknown
  >
>;

export const useTableData = <
  T extends Service.ResponseListResult<any>,
  R extends Service.RequestParams & Record<string, any>
>(
  tableProps: ComputedRef<BasicTableProps>,
  { pagination, setPagination }: TableDataProps
) => {
  const { loading, data, send, ...rest } = useRequest(
    tableProps.value.request as TableRequest<T, R>,
    {
      immediate: Boolean(tableProps.value.request)
    }
  );

  const getRowKey = computed(() => {
    const { rowKey } = unref(tableProps);
    return rowKey
      ? rowKey
      : () => {
          return "key";
        };
  });

  const resultData = computed(() => data.value?.data);
  const tableData = computed(() => resultData.value?.list || unref(tableProps).data || []);
  const page = computed(() => resultData.value?.page || 1);
  const pageSize = computed(
    () => resultData.value?.pageSize || componentSetting.table.defaultPageSize
  );
  const itemCount = computed(() => resultData.value?.total || 0);

  const variables = computed(() => ({
    page: page.value,
    pageSize: pageSize.value,
    ...unref(tableProps).filters
  }));

  const refetch = async (params: R) => {
    loading.value = true;
    return await send(params);
  };

  watch([page, pageSize, itemCount], () => {
    setPagination({
      page: page.value,
      pageSize: pageSize.value,
      itemCount: itemCount.value
    });
  });

  watch(
    [
      () => tableProps.value.filters,
      () => pagination.value?.page,
      () => pagination.value?.pageSize
    ],
    () => {
      const props = unref(tableProps);
      const paginationInfo = unref(pagination) as PaginationProps;
      const page = paginationInfo?.page || 1;
      const pageSize = paginationInfo?.pageSize || componentSetting.table.defaultPageSize;
      const params = {
        page,
        pageSize,
        ...unref(props.filters)
      };
      send(params as R);
    }
  );

  return {
    loading,
    tableData,
    page,
    pageSize,
    itemCount,
    variables,
    getRowKey,
    refetch,
    ...rest
  };
};
