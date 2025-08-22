<script setup lang="ts">
import { ref } from "vue";

const currentTab = ref<string>("basic");
</script>

<template>
  <n-card>
    <n-tabs v-model:value="currentTab" type="line" animated>
      <n-tab-pane name="basic" tab="基本设置">
        <BasicSetting />
      </n-tab-pane>
      <n-tab-pane name="safety" tab="安全设置">
        <SafetySetting />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>
