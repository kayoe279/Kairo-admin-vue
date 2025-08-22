<script lang="ts" setup>
import SvgIcon from "@/components/atoms/SvgIcon.vue";
import { appConfig } from "@/lib/settings/app";
import { useUserStore } from "@/store";
import { useDialog, useMessage } from "naive-ui";
import { computed, h, ref } from "vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const message = useMessage();
const dialog = useDialog();
const router = useRouter();

const nickname = computed(() => userStore.userInfo?.nickname);

const avatarOptions = ref([
  {
    label: "个人设置",
    key: "setting-account",
    icon: () => h(SvgIcon, { icon: "solar:settings-outline" })
  },
  {
    label: "退出登录",
    key: "logout",
    icon: () => h(SvgIcon, { icon: "solar:logout-2-broken" })
  }
]);

//头像下拉菜单
const onSelect = (key: string) => {
  switch (key) {
    case "setting-account":
      router.push({ name: "setting" });
      break;
    case "logout":
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
      <div class="flex cursor-pointer items-center justify-center gap-x-2">
        <n-avatar :src="appConfig.avatar" round class="shadow-lg ring-2 ring-blue-100" />
        <span v-if="nickname">{{ nickname }}</span>
      </div>
    </n-dropdown>
  </div>
</template>
