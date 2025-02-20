<script setup lang="ts">
import { DRAWER_WIDTH } from "@/lib/constants";
import { useAppStore, useThemeSettingStore } from "@/store";
import { useMessage } from "naive-ui";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const message = useMessage();
const appStore = useAppStore();
const themeStore = useThemeSettingStore();
const { open } = storeToRefs(appStore);

const resetSetting = () => {
  appStore.resetAppSetting();
  themeStore.resetDesignSetting();
  message.success(t("app.resetSuccess"));
};
</script>

<template>
  <n-drawer v-model:show="open" :width="DRAWER_WIDTH" placement="right">
    <n-drawer-content :title="$t('app.projectSetting')" :native-scrollbar="false" closable>
      <div>
        <n-divider title-placement="center">{{ $t("app.theme.title") }}</n-divider>
        <ThemeMode />

        <n-divider title-placement="center">{{ $t("app.layout.title") }}</n-divider>
        <LayoutMode />

        <n-divider title-placement="center">{{ $t("app.theme.themeColor") }}</n-divider>
        <ThemeColor />

        <n-divider title-placement="center">{{ $t("app.pageFeature.title") }}</n-divider>
        <PageFeatures />

        <n-divider title-placement="center">{{ $t("app.animation.title") }}</n-divider>
        <Animation />
      </div>

      <template #footer>
        <div class="flex w-full items-center justify-center">
          <n-button strong secondary type="error" @click="resetSetting">
            {{ $t("app.resetConfig") }}
          </n-button>
        </div>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped>
.n-divider:not(.n-divider--vertical) {
  margin: 12px 0;
}
</style>
