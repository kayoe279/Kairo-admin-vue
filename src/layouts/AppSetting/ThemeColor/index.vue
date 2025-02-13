<template>
  <div class="space-y-4 py-3">
    <SettingItem title="主色">
      <ColorPicker
        :color="themeStore.themeColor"
        :palettes="themeStore.appThemeList"
        @update:color="updateThemeColor($event, 'primary')"
      />
    </SettingItem>
    <SettingItem title="信息色">
      <ColorPicker
        :color="themeStore.infoColor"
        :palettes="themeStore.appThemeList"
        @update:color="updateThemeColor($event, 'info')"
      />
    </SettingItem>
    <SettingItem title="成功色">
      <ColorPicker
        :color="themeStore.successColor"
        :palettes="themeStore.appThemeList"
        @update:color="updateThemeColor($event, 'success')"
      />
    </SettingItem>
    <SettingItem title="警告色">
      <ColorPicker
        :color="themeStore.warningColor"
        :palettes="themeStore.appThemeList"
        @update:color="updateThemeColor($event, 'warning')"
      />
    </SettingItem>
    <SettingItem title="错误色">
      <ColorPicker
        :color="themeStore.errorColor"
        :palettes="themeStore.appThemeList"
        @update:color="updateThemeColor($event, 'error')"
      />
    </SettingItem>
  </div>
</template>

<script lang="ts" setup>
import { type ThemeType, useThemeSettingStore } from "@/store/modules/themeSetting";

const themeStore = useThemeSettingStore();

const updateThemeColor = (color: string, type: ThemeType) => {
  themeStore.setThemeColor(type, color);
};
</script>
