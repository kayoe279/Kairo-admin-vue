import { Alova } from "@/lib/http/alova/index";

//获取table
export function getTableList(params) {
  return Alova.Get("/table/list", { params });
}
