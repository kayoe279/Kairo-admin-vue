import { usePermission } from "@/hooks/usePermission";
import { RoleType } from "@/service/types";
import type { Directive } from "vue";

const permissionDirective: Directive<HTMLElement, RoleType | RoleType[]> = (el, binding) => {
  const { hasPermission } = usePermission();

  function updataPermission(el: HTMLElement, permission: RoleType | RoleType[]) {
    if (!permission) {
      throw new Error("v-permission Directive with no explicit role attached");
    }

    const permissions = typeof permission === "string" ? [permission] : permission;
    if (!hasPermission(permissions)) {
      el.parentElement?.removeChild(el);
    }
  }

  updataPermission(el, binding.value);
};

export default permissionDirective;
