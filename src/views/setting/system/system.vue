<script setup lang="ts">
import { computed, ref } from "vue";

interface SettingTab {
  name: string;
  desc: string;
  key: number;
}

const settingTabs: SettingTab[] = [
  {
    name: "基本设置",
    desc: "系统常规设置",
    key: 1
  },
  {
    name: "显示设置",
    desc: "系统显示设置",
    key: 2
  },
  {
    name: "邮件设置",
    desc: "系统邮件设置",
    key: 3
  }
];

const currentTab = ref<number>(1);

const currentTabTitle = computed(() => {
  const tab = settingTabs.find((tab) => tab.key === currentTab.value);
  return tab?.name || "基本设置";
});

const selectTab = (tab: SettingTab) => {
  currentTab.value = tab.key;
};
</script>

<template>
  <div>
    <n-grid :x-gap="24">
      <n-grid-item span="6">
        <n-card :bordered="false" size="small" class="proCard">
          <n-thing
            v-for="item in settingTabs"
            :key="item.key"
            :class="[
              'mx-[-16px] mb-[10px] cursor-pointer px-4 py-[5px] transition-colors',
              'hover:bg-gray-50',
              currentTab === item.key ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            ]"
            @click="selectTab(item)"
          >
            <template #header>
              <span :class="currentTab === item.key ? 'text-blue-600' : ''">
                {{ item.name }}
              </span>
            </template>
            <template #description>{{ item.desc }}</template>
          </n-thing>
        </n-card>
      </n-grid-item>
      <n-grid-item span="18">
        <n-card :bordered="false" size="small" :title="currentTabTitle" class="proCard">
          <BasicSystemSetting v-if="currentTab === 1" />
          <RevealSetting v-if="currentTab === 2" />
          <EmailSetting v-if="currentTab === 3" />
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>
