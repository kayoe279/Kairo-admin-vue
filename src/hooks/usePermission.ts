import { RoleType } from "@/service/types";
import { useUserStore } from "@/store";

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
