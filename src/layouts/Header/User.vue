<script lang="ts" setup>
import { appConfig } from "@/lib/settings/app";
import { useUserStore } from "@/store";
import { useDialog, useMessage } from "naive-ui";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { avatarOptions } from "~/mock/system/menu";

const userStore = useUserStore();
const message = useMessage();
const dialog = useDialog();
const router = useRouter();

const nickname = computed(() => userStore.userInfo?.nickname);

//头像下拉菜单
const onSelect = (key: number) => {
  switch (key) {
    case 1:
      router.push({ name: "setting" });
      break;
    case 2:
      doLogout();
      break;
  }
};

// 退出登录
const doLogout = () => {
  dialog.warning({
    title: "提示",
    content: "您确定要退出登录吗",
    positiveText: "确定",
    negativeText: "取消",
    transformOrigin: "center",
    onPositiveClick: async () => {
      await userStore.logout();
      message.success("成功退出登录");
    }
  });
};
</script>

<template>
  <div class="flex items-center justify-center">
    <n-dropdown trigger="hover" @select="onSelect" :options="avatarOptions">
      <div class="flex cursor-pointer items-center justify-center">
        <n-avatar :src="appConfig.avatar" round />
        <span v-if="nickname" class="ml-2">{{ nickname }}</span>
      </div>
    </n-dropdown>
  </div>
</template>
