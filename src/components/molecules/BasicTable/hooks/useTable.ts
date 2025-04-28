import { computed, unref } from 'vue';
import type { BasicTableProps } from '../types/table';
import { useDataSource } from './useDataSource';
import { usePagination } from './usePagination';
import { useLoading } from './useLoading';

export function useTable(props: BasicTableProps, { emit, tableRef }) {
  const { getDataSourceRef, getDataSource, getRowKey, reload } = useDataSource(props, {
    emit,
    tableRef
  });

  const { getPaginationInfo, setPagination } = usePagination(props);
  const { getLoading, setLoading } = useLoading(props);

  // 获取表格绑定值
  const getBindValues = computed(() => {
    const tableData = unref(getDataSourceRef);
    return {
      ...props,
      loading: unref(getLoading),
      data: tableData,
      rowKey: unref(getRowKey),
      pagination: unref(getPaginationInfo)
    };
  });

  return {
    getBindValues,
    getPaginationInfo,
    getDataSource,
    reload,
    setLoading
  };
} 