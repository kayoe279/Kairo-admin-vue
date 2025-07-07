import { mockRequest } from "@/service";
import type { UserListParams, UserListResponse } from "@/types/api";

export const getUserList = (params: UserListParams) =>
  mockRequest.Get<UserListResponse>("/api/table/list", { params });
