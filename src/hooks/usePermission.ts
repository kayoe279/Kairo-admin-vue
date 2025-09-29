import { RoleType } from "@/service/types";
import { useUserStore } from "@/store";
import { RouteMeta } from "@/types";

/** 权限判断 */
export const usePermission = () => {
  const userStore = useUserStore();

  // 是否包含其中某个权限
  const hasPermission = (accesses: RoleType[]) => {
    if (!accesses || !accesses.length) return true;

    const roles = userStore.userInfo?.user_metadata?.roles || [];
    return accesses.some((r) => roles.includes(r));
  };

  // 包含所有权限
  const hasEveryPermission = (accesses: RoleType[]) => {
    if (!accesses || !accesses.length) return true;

    const roles = userStore.userInfo?.user_metadata?.roles || [];
    return accesses.every((r) => roles?.includes(r));
  };

  return {
    hasPermission,
    hasEveryPermission
  };
};

export const useRequireAuth = (meta: RouteMeta) => {
  // 如果设置了 ignoreAuth，不需要验证
  if (meta.ignoreAuth) {
    return false;
  }

  // 如果明确设置了 requireAuth: false，不需要验证
  if (meta.requireAuth === false) {
    return false;
  }

  // 默认需要验证
  return true;
};
