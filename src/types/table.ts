import type { PaginationProps } from "naive-ui";
import type { Ref } from "vue";

// 分页参数接口
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 表格响应数据接口
export interface TableResponse<T = any> {
  page: number;
  pageSize: number;
  total: number;
  list: T[];
  params?: Record<string, any>;
}

// useTable hook 选项
export interface UseTableOptions<T = any> {
  defaultPageSize?: number;
  pageSizes?: number[];
  immediate?: boolean;
  searchParams?: Record<string, any>;
}

// useTable hook 返回值
export interface UseTableReturn<T = any> {
  tableData: Ref<T[]>;
  loading: Ref<boolean>;
  pagination: Ref<PaginationProps>;
  refresh: (params?: Record<string, any>) => void;
  updateSearchParams: (params: Record<string, any>) => void;
}
