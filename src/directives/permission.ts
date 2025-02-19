import { usePermission } from "@/hooks/usePermission";
import type { Directive } from "vue";

const permissionDirective: Directive<HTMLElement, Entity.RoleType | Entity.RoleType[]> = (
  el,
  binding
) => {
  const { hasPermission } = usePermission();

  function updataPermission(el: HTMLElement, permission: Entity.RoleType | Entity.RoleType[]) {
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
