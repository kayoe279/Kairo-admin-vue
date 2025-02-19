import { request } from "@/service";

interface LoginParams {
  username: string;
  password: string;
}

export const login = (data: LoginParams) => {
  const methodInstance = request.Post<Service.ResponseResult<Api.Login.Info>>("/login", data);
  methodInstance.meta = {
    authRole: null
  };
  return methodInstance;
};
export const refreshToken = (data: any) => {
  const method = request.Post<Service.ResponseResult<Api.Login.Info>>("/updateToken", data);
  method.meta = {
    authRole: "refreshToken"
  };
  return method;
};

export function getUserRoutes(params: { id: number }) {
  return request.Get<Service.ResponseResult<AppRoute.DynamicRouteRecordRaw[]>>("/getUserRoutes", {
    params
  });
}
