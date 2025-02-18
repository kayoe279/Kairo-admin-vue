import { useUserStore } from "@/store";

/** 权限判断 */
export function usePermission() {
  const userStore = useUserStore();

  function hasPermission(permission?: Entity.RoleType[]) {
    if (!permission) return true;

    if (!userStore.userInfo) return false;
    const { roles } = userStore.userInfo;

    let has = roles?.includes("super");
    if (!has) {
      has = permission.every((i) => roles?.includes(i));
    }
    return has;
  }

  return {
    hasPermission
  };
}
