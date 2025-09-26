import { ResponseListResult } from "./services";
import { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

// 导航列表类型定义
export type NavListItem = Tables<"navList">;
export type NavListInsert = TablesInsert<"navList">;
export type NavListUpdate = TablesUpdate<"navList">;

// 查询参数类型
export interface ListQueryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sortBy?: keyof NavListItem | string;
  sortOrder?: "asc" | "desc" | string;
  disabled?: string;
}

// API 响应类型
export interface ListResponse extends ResponseListResult<NavListItem> {}

export interface DetailResponse<T = NavListItem> {
  data: T | null;
  error: any;
}

export interface MutationResponse<T = NavListItem> {
  data: T | null;
  error: any;
}
