import { Alova } from "@/service";

//获取table
export function getTableList(params) {
  return Alova.Get("/table/list", { params });
}
