<template>
  <RouterView>
    <template #default="{ Component, route }">
      <Transition :name="getTransitionName" mode="out-in" appear>
        <KeepAlive :include="asyncRouteStore.cacheRoutes">
          <component v-if="reloadFlag" :is="Component" :key="route.fullPath" />
        </KeepAlive>
      </Transition>
    </template>
  </RouterView>
</template>

<script setup lang="ts">
import { useAppSettingStore } from "@/store/modules/appSetting";
import { useAsyncRouteStore } from "@/store/modules/asyncRoute";
import { storeToRefs } from "pinia";
import { computed, unref } from "vue";

const asyncRouteStore = useAsyncRouteStore();
const settingStore = useAppSettingStore();
const { isPageAnimate, pageAnimateType, reloadFlag } = storeToRefs(settingStore);

const getTransitionName = computed(() => {
  return unref(isPageAnimate) ? unref(pageAnimateType) : "";
});
</script>
