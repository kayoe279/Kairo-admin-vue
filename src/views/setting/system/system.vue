<script setup lang="ts">
import { ref } from "vue";

const currentTab = ref<string>("basic");
</script>

<template>
  <n-card size="small">
    <n-tabs v-model:value="currentTab" type="line" animated>
      <n-tab-pane name="basic" tab="基本设置">
        <BasicSystemSetting />
      </n-tab-pane>
      <n-tab-pane name="display" tab="显示设置">
        <RevealSetting />
      </n-tab-pane>
      <n-tab-pane name="email" tab="邮件设置">
        <EmailSetting />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>
