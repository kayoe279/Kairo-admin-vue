import { useUserStore } from "@/store";

/** 权限判断 */
export function usePermission() {
  const userStore = useUserStore();

  function hasPermission(permission?: Entity.RoleType[]) {
    if (!permission) return true;

    if (!userStore.info) return false;
    const { role } = userStore.info;

    let has = role.includes("super");
    if (!has) {
      has = permission.every((i) => role.includes(i));
    }
    return has;
  }

  return {
    hasPermission
  };
}
