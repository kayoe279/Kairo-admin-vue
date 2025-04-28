import { request } from "@/service";
import { useRequest } from "alova/client";

export const useBasicTableList = (params: any) => {
  const fetchList = () => {
    return request.Get<Service.ResponseResult<any>>("/api/table/list", { params });
  };
  const { data, ...rest } = useRequest(fetchList);

  return {
    ...rest,
    ...data.value
  };
};
