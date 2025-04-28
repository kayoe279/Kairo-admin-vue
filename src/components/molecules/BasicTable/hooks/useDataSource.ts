import type { BasicTableProps } from "../props";
import { computed, ref, unref } from "vue";

export function useDataSource(props: BasicTableProps, { emit }) {
  const dataSourceRef = ref<any[]>([]);

  // 获取行 key
  const getRowKey = computed(() => {
    const { rowKey } = props;
    return rowKey
      ? rowKey
      : () => {
          return "key";
        };
  });

  // 获取数据源
  const getDataSourceRef = computed(() => {
    const dataSource = unref(dataSourceRef);
    if (!dataSource || dataSource.length === 0) {
      return unref(dataSourceRef);
    }
    return unref(dataSourceRef);
  });

  // 设置数据源
  function setTableData(values: any[]) {
    dataSourceRef.value = values;
  }

  // 获取数据源
  function getDataSource(): any[] {
    return getDataSourceRef.value;
  }

  // 重新加载数据
  async function reload() {
    try {
      // const { request, beforeRequest, afterRequest } = props;
      // if (!request) return;
      // let params = { ...opt };
      // if (beforeRequest && isFunction(beforeRequest)) {
      //   params = (await beforeRequest(params)) || params;
      // }
      // const res = await request(params);
      // let resultInfo = res.data || [];
      // if (afterRequest && isFunction(afterRequest)) {
      //   resultInfo = (await afterRequest(resultInfo)) || resultInfo;
      // }
      // dataSourceRef.value = resultInfo;
      // emit("fetch-success", {
      //   items: unref(resultInfo),
      //   resultTotal: res.total
      // });
    } catch (error) {
      console.error(error);
      emit("fetch-error", error);
      dataSourceRef.value = [];
    } finally {
    }
  }

  return {
    getDataSourceRef,
    getDataSource,
    getRowKey,
    setTableData,
    reload
  };
}
