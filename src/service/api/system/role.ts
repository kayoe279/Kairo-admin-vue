import { Alova } from "@/service";

/**
 * @description: 角色列表
 */
export function getRoleList(params) {
  return Alova.Get("/role/list", { params });
}
