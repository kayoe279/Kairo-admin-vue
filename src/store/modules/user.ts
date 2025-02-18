import { storage } from "@/lib/Storage2";
import { ACCESS_TOKEN, CURRENT_USER, IS_SCREEN_LOCKED } from "@/lib/constants";
import { ResultEnum } from "@/lib/enums/httpEnum";
import { StoreEnum } from "@/lib/enums/storeEnum";
import { getUserInfo as getUserInfoApi, login as loginApi } from "@/service/api/system/user";
import { store } from "@/store";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

// TODO: add your own data
export type UserInfoType = {
  username: string;
  email: string;
  role: string[];
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
      const ex = 7 * 24 * 60 * 60;
      storage.set(ACCESS_TOKEN, result.token, ex);
      storage.set(CURRENT_USER, result, ex);
      storage.set(IS_SCREEN_LOCKED, false);
      setToken(result.token);
      setUserInfo(result);
    }
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
    setUserInfo({ username: "", email: "", role: [] });
    storage.remove(ACCESS_TOKEN);
    storage.remove(CURRENT_USER);
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
