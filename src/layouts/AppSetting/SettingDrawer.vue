<template>
  <n-drawer v-model:show="open" :width="DRAWER_WIDTH" placement="right">
    <n-drawer-content title="项目配置" :native-scrollbar="false" closable>
      <div>
        <n-divider title-placement="center">主题</n-divider>
        <ThemeMode />

        <n-divider title-placement="center">布局模式</n-divider>
        <LayoutMode />

        <n-divider title-placement="center">主题颜色</n-divider>
        <ThemeColor />

        <n-divider title-placement="center">页面功能</n-divider>
        <PageFeatures />

        <n-divider title-placement="center">动画</n-divider>
        <Animation />
      </div>

      <template #footer>
        <div class="flex w-full items-center justify-center">
          <n-button strong secondary type="error" @click="resetSetting"> 恢复默认配置 </n-button>
        </div>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { DRAWER_WIDTH } from "@/lib/constants";
import { useAppSettingStore } from "@/store/modules/appSetting";
import { useThemeSettingStore } from "@/store/modules/themeSetting";
import { useMessage } from "naive-ui";
import { storeToRefs } from "pinia";

const message = useMessage();
const settingStore = useAppSettingStore();
const themeStore = useThemeSettingStore();
const { open } = storeToRefs(settingStore);

const resetSetting = () => {
  settingStore.resetAppSetting();
  themeStore.resetDesignSetting();
  message.success("恢复默认配置成功");
};
</script>

<style scoped>
.n-divider:not(.n-divider--vertical) {
  margin: 12px 0;
}
</style>
