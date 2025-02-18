<script lang="ts" setup>
import { useAppStore } from "@/store";
import { storeToRefs } from "pinia";

const appStore = useAppStore();
const { headerSetting, multiTabsSetting, menuSetting, breadcrumbsSetting } = storeToRefs(appStore);
</script>

<template>
  <div class="space-y-4 py-3">
    <SettingItem title="顶部高度">
      <n-input-number v-model:value="headerSetting.height" class="w-30" />
    </SettingItem>
    <SettingItem title="固定顶部和多页签">
      <n-switch v-model:value="headerSetting.fixed" />
    </SettingItem>
    <SettingItem title="显示重载页面按钮">
      <n-switch v-model:value="headerSetting.isReload" />
    </SettingItem>

    <SettingItem title="显示多页签">
      <n-switch v-model:value="multiTabsSetting.show" />
    </SettingItem>
    <SettingItem title="多页签高度">
      <n-input-number v-model:value="multiTabsSetting.height" class="w-30" />
    </SettingItem>

    <SettingItem title="显示面包屑导航">
      <n-switch v-model:value="breadcrumbsSetting.show" />
    </SettingItem>
    <SettingItem title="显示面包屑显示图标">
      <n-switch v-model:value="breadcrumbsSetting.showIcon" />
    </SettingItem>

    <SettingItem title="菜单手风琴模式">
      <n-switch v-model:value="menuSetting.accordion" />
    </SettingItem>
    <SettingItem title="菜单展开宽度">
      <n-input-number v-model:value="menuSetting.menuWidth" class="w-30" />
    </SettingItem>
    <SettingItem title="菜单收缩宽度">
      <n-input-number v-model:value="menuSetting.minMenuWidth" class="w-30" />
    </SettingItem>
  </div>
</template>
