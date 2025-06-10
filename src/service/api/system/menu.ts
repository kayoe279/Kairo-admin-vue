import { mockRequest } from "@/service";

export interface ListDate {
  label: string;
  key: string;
  type: number;
  subtitle: string;
  openType: number;
  auth: string;
  path: string;
  children?: ListDate[];
}

/**
 * @description: 根据用户id获取用户菜单
 */
export function adminMenus() {
  return mockRequest.Get("/menus");
}

/**
 * 获取tree菜单列表
 * @param params
 */
export function getMenuList(params?) {
  return mockRequest.Get<{ list: ListDate[] }>("/menu/list", {
    params
  });
}
