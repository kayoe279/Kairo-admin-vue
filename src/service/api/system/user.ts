import { mockRequest } from "@/service";

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return mockRequest.Get("/admin_info", {
    meta: {
      isReturnNativeResponse: true
    }
  });
}

/**
 * @description: 用户登录
 */
export function login(params) {
  return mockRequest.Post(
    "/login",
    {
      params
    },
    {
      meta: {
        isReturnNativeResponse: true
      }
    }
  );
}

/**
 * @description: 用户修改密码
 */
export function changePassword(params, uid) {
  return mockRequest.Post(`/user/u${uid}/changepw`, { params });
}

/**
 * @description: 用户登出
 */
export function logout(params) {
  return mockRequest.Post("/login/logout", {
    params
  });
}
