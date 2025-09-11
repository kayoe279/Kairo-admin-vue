import { transformToMenus } from "@/lib/menu";
import { useAppStore } from "@/store";
import type { MenuInst } from "naive-ui";
import type { MenuMixedOption } from "naive-ui/es/menu/src/interface";
import { storeToRefs } from "pinia";
import { type Ref, onMounted, ref, unref, watch } from "vue";
import type { RouteRecordRaw } from "vue-router";
import { useRoute, useRouter } from "vue-router";

interface UseMenuOptions {
  routes: RouteRecordRaw[] | Ref<RouteRecordRaw[]>;
  onlyFirstLevel?: boolean;
}

export const useMenu = (options: UseMenuOptions) => {
  const { routes, onlyFirstLevel = false } = options;

  const route = useRoute();
  const router = useRouter();
  const appStore = useAppStore();
  const { menuSetting, locale } = storeToRefs(appStore);

  const menuInstRef = ref<MenuInst | null>(null);
  const menus = ref<MenuMixedOption[]>([]);
  const defaultExpandedKeys = ref<string[]>(
    route.matched?.map((item) => item.name as string) || []
  );
  const selectedValues = ref<string>(route.name as string);

  const updateDefaultExpandedKeys = () => {
    const oldDefaultExpandedKeys = [...(defaultExpandedKeys.value || [])];
    const currentDefaultExpandedKeys = route.matched?.map((item) => item.name as string) || [];
    if (menuSetting.value.accordion) {
      defaultExpandedKeys.value = currentDefaultExpandedKeys;
    } else {
      defaultExpandedKeys.value = [
        ...new Set([...oldDefaultExpandedKeys, ...currentDefaultExpandedKeys])
      ];
    }
  };

  // 更新选中的值
  const updateSelectedValues = () => {
    selectedValues.value = (route.meta?.activeMenu as string) || (route.name as string);
    updateDefaultExpandedKeys();
  };

  const updateMenus = () => {
    menus.value = transformToMenus(unref(routes), onlyFirstLevel);
    updateSelectedValues();
  };

  // 点击菜单
  const onMenuItemClick = (key: string) => {
    if (/http(s)?:/.test(key)) {
      window.open(key);
    } else {
      router.push({ name: key });
    }
  };

  // 监听语言变化
  watch(locale, () => {
    updateMenus();
  });

  // 监听路由变化
  watch(
    routes,
    () => {
      updateMenus();
    },
    { deep: true }
  );

  // 跟随页面路由变化，切换菜单选中状态
  watch(
    () => route.fullPath,
    () => {
      menuInstRef.value?.showOption(route.name as string);
      updateMenus();
    },
    {
      immediate: true
    }
  );

  onMounted(() => {
    updateMenus();
  });

  return {
    menuInstRef,
    menus,
    defaultExpandedKeys,
    selectedValues,
    menuSetting,
    onMenuItemClick
  };
};
