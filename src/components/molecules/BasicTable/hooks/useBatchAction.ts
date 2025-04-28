import { ref } from 'vue';

export function useBatchAction() {
  const selectedRowKeys = ref<string[]>([]);
  const selectedRows = ref<any[]>([]);

  // 选择行
  function onSelectChange(keys: string[], rows: any[]) {
    selectedRowKeys.value = keys;
    selectedRows.value = rows;
  }

  // 清空选择
  function clearSelection() {
    selectedRowKeys.value = [];
    selectedRows.value = [];
  }

  // 批量删除
  async function batchDelete(deleteFn: (keys: string[]) => Promise<void>) {
    if (selectedRowKeys.value.length === 0) {
      return;
    }
    try {
      await deleteFn(selectedRowKeys.value);
      clearSelection();
    } catch (error) {
      console.error('批量删除失败:', error);
    }
  }

  // 批量更新状态
  async function batchUpdateStatus(
    updateFn: (keys: string[], status: any) => Promise<void>,
    status: any
  ) {
    if (selectedRowKeys.value.length === 0) {
      return;
    }
    try {
      await updateFn(selectedRowKeys.value, status);
      clearSelection();
    } catch (error) {
      console.error('批量更新状态失败:', error);
    }
  }

  return {
    selectedRowKeys,
    selectedRows,
    onSelectChange,
    clearSelection,
    batchDelete,
    batchUpdateStatus
  };
} 