import { PageEnum } from "./enums/pageEnum";

export const DRAWER_WIDTH = 360;

// store 常量
// 不需要出现在标签页中的路由
export const TABS_WHITE_LIST = [
  PageEnum.REDIRECT_NAME,
  PageEnum.BASE_LOGIN_NAME,
  PageEnum.ERROR_PAGE_NAME
];
export const ACCESS_TOKEN = "ACCESS-TOKEN"; // 用户token
export const CURRENT_USER = "CURRENT-USER"; // 当前用户信息
export const IS_SCREEN_LOCKED = "IS-SCREEN-LOCKED"; // 是否锁屏
export const TABS_ROUTES = "TABS-ROUTES"; // 标签页

export const TAB_DATA_ID = "tab-data-id";
