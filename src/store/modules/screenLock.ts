import { storage } from "@/lib/Storage2";
import { IS_SCREEN_LOCKED } from "@/lib/constants";
import { StoreEnum } from "@/lib/enums/storeEnum";
import { defineStore } from "pinia";
import { ref } from "vue";

// 长时间不操作默认锁屏时间
const initTime = 60 * 60;

const isLockedStorage = storage.get(IS_SCREEN_LOCKED, false);

export type IScreenLockState = {
  isLocked: boolean; // 是否锁屏
  lockTime: number;
};

export const useScreenLockStore = defineStore(StoreEnum.screenLock, () => {
  const isLocked = ref(isLockedStorage);
  const lockTime = ref(0);

  const setLock = (payload: boolean) => {
    isLocked.value = payload;
    storage.set(IS_SCREEN_LOCKED, isLocked.value);
  };
  const setLockTime = (payload = initTime) => {
    lockTime.value = payload;
  };

  return {
    isLocked,
    lockTime,

    setLock,
    setLockTime
  };
});
