import { RoleType } from "@/service/types";
import { defineComponent } from "vue";
import { RouteRecordRaw } from "vue-router";

type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import("*.vue")>)
  | (() => Promise<T>);

/** 单个路由所携带的meta标识 */
export interface RouteMeta {
  /* 页面标题，通常必选。 */
  title?: string;
  /* 是否是根路由 */
  isRoot?: boolean;
  /* 图标，一般配合菜单使用 */
  icon?: Component | string;
  // 是否忽略权限
  ignoreAuth?: boolean;
  /* 可以访问的角色 */
  roles?: RoleType[];
  /* 是否开启页面缓存 */
  keepAlive?: boolean;

  /* 菜单排序。 */
  sort?: number;
  /* 嵌套外链  */
  externalLink?: string;
  /** 当前路由不在左侧菜单显示，但需要高亮某个菜单的情况 不设置默认去路由 name */
  activeMenu?: string;
  /* 当前路由是否会被添加到Tab中, 有些路由我们并不想在菜单中显示，比如某些编辑页面。 */
  hidden?: boolean;
  /** 当前路由是否会被固定在Tab中,用于一些常驻页面 */
  affix?: boolean;
}

export type MetaKeys = keyof RouteMeta;

/**
 * API返回的动态路由结构
 */
export interface DynamicRoute {
  path: string;
  name: string;
  redirect?: string;
  component?: any;
  children?: DynamicRoute[];
  meta: RouteMeta;
}

// 路由模块
export interface IRouteModuleType {
  default: Array<RouteRecordRaw> | RouteRecordRaw;
}
