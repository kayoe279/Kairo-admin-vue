import { mockRequest } from "@/service";

//获取table
export async function getTableList(params) {
  const res = await mockRequest.Get("/api/table/list", { params });
  console.log("%c [ xxxxx ]-10", "font-size:13px; background:pink; color:#bf2c9f;", res);
  return res;
}
