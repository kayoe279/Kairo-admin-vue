import { StoreEnum } from "@/lib";
import {
  getUserToken,
  removeRefreshToken,
  removeUserToken,
  setRefreshToken,
  setUserToken
} from "@/lib/cookie";
import { getUserInfo, removeUserInfo, setUserInfo } from "@/lib/storage";
import { useRouteStore, useTabsStore } from "@/store";
import { UserInfo } from "@/types";
import { defineStore } from "pinia";
import { ref, unref } from "vue";
import { useRouter } from "vue-router";

export const useUserStore = defineStore(StoreEnum.user, () => {
  const tabsStore = useTabsStore();
  const routeStore = useRouteStore();
  const router = useRouter();

  const userInfo = ref<UserInfo | null>(getUserInfo());
  const token = ref(getUserToken());

  const updateUserInfo = async (result: UserInfo) => {
    const { accessToken, refreshToken } = result;
    setUserToken(accessToken);
    setRefreshToken(refreshToken);
    setUserInfo(result);
    token.value = accessToken;
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
    removeUserToken();
    removeRefreshToken();
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
    updateUserInfo,
    logout
  };
});
