import { COOKIE_ACCESS_TOKEN, COOKIE_LANG, COOKIE_REFRESH_TOKEN } from "./constants";
import Cookies from "universal-cookie";

const STORAGE_PREFIX = import.meta.env.VITE_STORAGE_PREFIX;
const CACHE_EXPIRE = import.meta.env.VITE_CACHE_EXPIRE; //7天

export const createCookie = <T extends Cookie.Local>() => {
  const cookies = new Cookies();

  function set<K extends keyof T>(key: K, value: T[K], expire: number = 1 * CACHE_EXPIRE) {
    cookies.set(`${STORAGE_PREFIX}${String(key)}`, value, {
      expires: new Date(new Date().getTime() + expire * 1000)
    });
  }

  function get<K extends keyof T>(key: K) {
    const value = cookies.get(`${STORAGE_PREFIX}${String(key)}`);
    if (!value) {
      remove(key);
      return null;
    }
    return value;
  }

  function remove(key: keyof T) {
    cookies.remove(`${STORAGE_PREFIX}${String(key)}`);
  }

  return {
    set,
    get,
    remove
  };
};

export const cookie = createCookie();

// 用户token
export const getUserToken = () => {
  return cookie.get(COOKIE_ACCESS_TOKEN);
};
export const setUserToken = (token: string) => {
  cookie.set(COOKIE_ACCESS_TOKEN, token);
};
export const removeUserToken = () => {
  cookie.remove(COOKIE_ACCESS_TOKEN);
};

// 刷新token
export const getRefreshToken = () => {
  return cookie.get(COOKIE_REFRESH_TOKEN);
};
export const setRefreshToken = (refreshToken: string) => {
  cookie.set(COOKIE_REFRESH_TOKEN, refreshToken);
};
export const removeRefreshToken = () => {
  cookie.remove(COOKIE_REFRESH_TOKEN);
};

// 当前语言
export const getCurrentLang = () => {
  return cookie.get(COOKIE_LANG);
};
export const setCurrentLang = (lang: App.lang) => {
  cookie.set(COOKIE_LANG, lang);
};
export const removeCurrentLang = () => {
  cookie.remove(COOKIE_LANG);
};
