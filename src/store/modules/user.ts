import { ACCESS_TOKEN, CURRENT_USER, IS_SCREEN_LOCKED } from "@/lib/constants";
import { removeUserToken, setUserToken } from "@/lib/cookie";
import { ResultEnum } from "@/lib/enums/httpEnum";
import { StoreEnum } from "@/lib/enums/storeEnum";
import { local } from "@/lib/storage";
import { getUserInfo as getUserInfoApi, login as loginApi } from "@/service/api/system/user";
import { store, useRouteStore } from "@/store";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

// TODO: add your own data
export type UserInfoType = {
  username: string;
  email: string;
  roles: string[];
};

type LoginParams = {
  username: string;
  password: string;
};

export interface IUserState {
  token: string;
  username: string;
  welcome: string;
  avatar: string;
  permissions: any[];
  info: UserInfoType;
}

export const useUserStore = defineStore(StoreEnum.user, () => {
  const routeStore = useRouteStore();

  const userInfo = ref<Api.Login.Info | null>({
    userName: "kay",
    id: 1,
    roles: ["super"],
    accessToken: "123",
    refreshToken: "123"
  });
  const token = ref("");
  const username = ref("");
  const avatar = ref("");
  const permissions = ref<any[]>([]);
  const info = ref<UserInfoType | null>(null);

  const getToken = computed(() => token.value);
  const getAvatar = computed(() => avatar.value);
  const getNickname = computed(() => username.value);
  const getPermissions = computed(() => permissions.value);
  const getUserInfo = computed(() => info.value);

  const setToken = (_token: string) => {
    token.value = _token;
  };
  const setAvatar = (_avatar: string) => {
    avatar.value = _avatar;
  };
  const setPermissions = (_permissions: any[]) => {
    permissions.value = _permissions;
  };
  const setUserInfo = (_info: UserInfoType) => {
    info.value = _info;
  };

  const login = async (params: LoginParams) => {
    const response = await loginApi(params);
    const { result, code } = response;
    if (code === ResultEnum.SUCCESS) {
      // const ex = 7 * 24 * 60 * 60;
      setUserToken(result.token);
      // storage.set(CURRENT_USER, result, ex);

      setToken(result.token);
      setUserInfo(result);
    }
    await routeStore.initAuthRoute();
    return response;
  };

  const getInfo = async () => {
    const data = await getUserInfoApi();
    const { result } = data;
    if (result.permissions && result.permissions.length) {
      const permissionsList = result.permissions;
      setPermissions(permissionsList);
      setUserInfo(result);
    } else {
      throw new Error("getInfo: permissionsList must be a non-null array !");
    }
    setAvatar(result.avatar);
    return result;
  };

  const logout = async () => {
    setPermissions([]);
    setUserInfo({ username: "", email: "", roles: [] });
    removeUserToken();
  };

  return {
    token,
    username,
    avatar,
    permissions,
    info,
    getToken,
    getAvatar,
    getNickname,
    getPermissions,
    getUserInfo,
    userInfo,
    setToken,
    setAvatar,
    setPermissions,
    setUserInfo,
    login,
    getInfo,
    logout
  };
});

// Need to be used outside the setup
export function useUser() {
  return useUserStore(store);
}
