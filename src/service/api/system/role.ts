import { mockRequest } from "@/service";

/**
 * @description: 角色列表
 */
export function getRoleList(params) {
  return mockRequest.Get("/role/list", { params });
}
