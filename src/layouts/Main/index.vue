<template>
  <RouterView>
    <template #default="{ Component, route }">
      <template v-if="mode === 'production'">
        <transition :name="getTransitionName" mode="out-in" appear>
          <keep-alive v-if="keepAliveComponents.length" :include="keepAliveComponents">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
          <component v-else :is="Component" :key="route.fullPath" />
        </transition>
      </template>
      <template v-else>
        <keep-alive v-if="keepAliveComponents.length" :include="keepAliveComponents">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
        <component v-else :is="Component" :key="route.fullPath" />
      </template>
    </template>
  </RouterView>
</template>

<script setup lang="ts">
import { getEnv } from "@/lib/env";
import { useAppSettingStore } from "@/store/modules/appSetting";
import { useAsyncRouteStore } from "@/store/modules/asyncRoute";
import { storeToRefs } from "pinia";
import { computed, ref, unref } from "vue";

const asyncRouteStore = useAsyncRouteStore();
const settingStore = useAppSettingStore();
const { isPageAnimate, pageAnimateType } = storeToRefs(settingStore);

const mode = ref(getEnv());

const keepAliveComponents = computed(() => asyncRouteStore.keepAliveComponents);
const getTransitionName = computed(() => {
  return unref(isPageAnimate) ? unref(pageAnimateType) : "";
});
</script>
