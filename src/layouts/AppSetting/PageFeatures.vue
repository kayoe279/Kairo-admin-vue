<script lang="ts" setup>
import { useAppStore } from "@/store";
import { storeToRefs } from "pinia";

const appStore = useAppStore();
const { headerSetting, multiTabsSetting, menuSetting, breadcrumbsSetting } = storeToRefs(appStore);
</script>

<template>
  <div class="space-y-4 py-3">
    <SettingItem :title="$t('app.pageFeature.headerHeight')">
      <n-input-number v-model:value="headerSetting.height" class="w-30" />
    </SettingItem>
    <SettingItem :title="$t('app.pageFeature.fixedHeaderAndTabs')">
      <n-switch v-model:value="headerSetting.fixed" />
    </SettingItem>
    <SettingItem :title="$t('app.pageFeature.showReloadButton')">
      <n-switch v-model:value="headerSetting.isReload" />
    </SettingItem>

    <SettingItem :title="$t('app.pageFeature.showTabs')">
      <n-switch v-model:value="multiTabsSetting.show" />
    </SettingItem>
    <SettingItem :title="$t('app.pageFeature.tabHeight')">
      <n-input-number v-model:value="multiTabsSetting.height" class="w-30" />
    </SettingItem>

    <SettingItem :title="$t('app.pageFeature.showBreadcrumb')">
      <n-switch v-model:value="breadcrumbsSetting.show" />
    </SettingItem>
    <SettingItem :title="$t('app.pageFeature.showBreadcrumbIcon')">
      <n-switch v-model:value="breadcrumbsSetting.showIcon" />
    </SettingItem>

    <SettingItem :title="$t('app.pageFeature.menuAccordion')">
      <n-switch v-model:value="menuSetting.accordion" />
    </SettingItem>
    <SettingItem :title="$t('app.pageFeature.menuWidth')">
      <n-input-number v-model:value="menuSetting.menuWidth" class="w-30" />
    </SettingItem>
    <SettingItem :title="$t('app.pageFeature.minMenuWidth')">
      <n-input-number v-model:value="menuSetting.minMenuWidth" class="w-30" />
    </SettingItem>
  </div>
</template>
