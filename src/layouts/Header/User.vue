<script lang="ts" setup>
import SvgIcon from "@/components/ui/SvgIcon.vue";
import { appConfig } from "@/lib/settings/app";
import { useUserStore } from "@/store";
import { useDialog, useMessage } from "naive-ui";
import { computed, h } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const message = useMessage();
const dialog = useDialog();
const router = useRouter();
const { t } = useI18n();

const nickname = computed(() => userStore.userInfo?.nickname);

const avatarOptions = computed(() => [
  {
    label: t("auth.userSetting"),
    key: "setting-account",
    icon: () => h(SvgIcon, { icon: "solar:settings-outline" })
  },
  {
    label: t("auth.logout"),
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
    title: t("common.tip"),
    content: t("auth.logoutConfirm.content"),
    positiveText: t("common.ok"),
    negativeText: t("common.cancel"),
    transformOrigin: "center",
    onPositiveClick: async () => {
      await userStore.logout();
      message.success(t("auth.logoutConfirm.successMessage"));
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
