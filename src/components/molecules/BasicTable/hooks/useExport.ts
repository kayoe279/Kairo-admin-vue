import { ref } from 'vue';
import type { BasicColumn } from '../types/table';

export function useExport() {
  const exportLoading = ref(false);

  // 导出数据
  async function exportData(
    columns: BasicColumn[],
    data: any[],
    filename: string = 'export.csv'
  ) {
    try {
      exportLoading.value = true;
      const headers = columns.map((col) => col.title);
      const keys = columns.map((col) => col.key);
      const csvContent = [
        headers.join(','),
        ...data.map((row) =>
          keys
            .map((key) => {
              const value = row[key];
              return typeof value === 'string' && value.includes(',')
                ? `"${value}"`
                : value;
            })
            .join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      exportLoading.value = false;
    }
  }

  return {
    exportLoading,
    exportData
  };
} 