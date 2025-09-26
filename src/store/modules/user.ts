import { StoreEnum } from "@/lib";
import { getAccessToken, getUserInfo, removeUserInfo } from "@/lib/cookie";
import { useRouteStore, useTabsStore } from "@/store";
import { User } from "@supabase/supabase-js";
import { defineStore } from "pinia";
import { computed, ref, unref } from "vue";
import { useRouter } from "vue-router";

export const useUserStore = defineStore(StoreEnum.user, () => {
  const tabsStore = useTabsStore();
  const routeStore = useRouteStore();
  const router = useRouter();

  const userInfo = ref<User | null>(getUserInfo());
  const token = ref(getAccessToken());

  const isAuthenticated = computed(() => {
    const userInfo = getUserInfo();
    const accessToken = getAccessToken();
    return !!userInfo && !!accessToken;
  });

  const updateUserInfo = async (result: User) => {
    userInfo.value = result;

    // 初始化路由
    await routeStore.initAuthRoute();

    const route = unref(router.currentRoute);
    const toPath = decodeURIComponent((route.query?.redirect || "/") as string);
    router.replace(toPath ?? "/");
  };

  // 退出登录
  const logout = async () => {
    const route = unref(router.currentRoute);
    removeUserInfo();

    routeStore.resetRoutes();
    tabsStore.clearAllTabs();

    token.value = "";
    userInfo.value = null;
    if (!route?.meta?.ignoreAuth) {
      router.replace({
        name: "login",
        query: {
          redirect: route.fullPath
        }
      });
    }
  };

  return {
    token,
    userInfo,
    isAuthenticated,
    updateUserInfo,
    logout
  };
});
