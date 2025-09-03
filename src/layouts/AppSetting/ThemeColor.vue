<script lang="ts" setup>
import { type ThemeType, useThemeStore } from "@/store/modules/theme";

const themeStore = useThemeStore();

const updateThemeColor = (color: string, type: ThemeType) => {
  themeStore.setThemeColor(type, color);
};
</script>

<template>
  <div class="space-y-4 py-3">
    <SettingItem :title="$t('app.theme.primary')">
      <ColorPicker
        :color="themeStore.primaryColor"
        :palettes="themeStore.appThemeList"
        @update:color="updateThemeColor($event, 'primary')"
      />
    </SettingItem>
    <SettingItem :title="$t('app.theme.info')">
      <ColorPicker
        :color="themeStore.infoColor"
        :palettes="themeStore.appThemeList"
        @update:color="updateThemeColor($event, 'info')"
      />
    </SettingItem>
    <SettingItem :title="$t('app.theme.success')">
      <ColorPicker
        :color="themeStore.successColor"
        :palettes="themeStore.appThemeList"
        @update:color="updateThemeColor($event, 'success')"
      />
    </SettingItem>
    <SettingItem :title="$t('app.theme.warning')">
      <ColorPicker
        :color="themeStore.warningColor"
        :palettes="themeStore.appThemeList"
        @update:color="updateThemeColor($event, 'warning')"
      />
    </SettingItem>
    <SettingItem :title="$t('app.theme.error')">
      <ColorPicker
        :color="themeStore.errorColor"
        :palettes="themeStore.appThemeList"
        @update:color="updateThemeColor($event, 'error')"
      />
    </SettingItem>
  </div>
</template>
