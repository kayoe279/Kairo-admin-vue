export const DRAWER_WIDTH = 360;

export const PAGE = {
  LOGIN_NAME: "login",
  LOGIN_PATH: "/login",
  REDIRECT_NAME: "redirect",
  REDIRECT_PATH: "/redirect",
  ERROR_PAGE_NAME: "404",
  HOME_NAME: "dashboard",
  HOME_NAME_REDIRECT: "dashboard-workplace"
} as const;

export const ACCESS_TOKEN = "ACCESS-TOKEN"; // 用户token
export const CURRENT_USER = "CURRENT-USER"; // 当前用户信息
export const IS_SCREEN_LOCKED = "IS-SCREEN-LOCKED"; // 是否锁屏
export const TABS_ROUTES = "TABS-ROUTES"; // 标签页

export const TAB_DATA_ID = "tab-data-id";

export const COOKIE_ACCESS_TOKEN = "kairo_accessToken";
export const COOKIE_REFRESH_TOKEN = "kairo_refreshToken";

export const STORAGE_PREFIX = "kairo_";
export const STORAGE_USER_INFO = "userInfo";
export const STORAGE_LOGIN_ACCOUNT = "loginAccount";
export const STORAGE_LOCALE = "locale";
