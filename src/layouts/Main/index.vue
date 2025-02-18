<script setup lang="ts">
import { useAppStore, useRouteStore } from "@/store";
import { storeToRefs } from "pinia";
import { computed, unref } from "vue";

const routeStore = useRouteStore();
const appStore = useAppStore();
const { isPageAnimate, pageAnimateType, reloadFlag } = storeToRefs(appStore);

const getTransitionName = computed(() => {
  return unref(isPageAnimate) ? unref(pageAnimateType) : "";
});
</script>

<template>
  <RouterView>
    <template #default="{ Component, route }">
      <Transition :name="getTransitionName" mode="out-in" appear>
        <KeepAlive :include="routeStore.cacheRoutes">
          <component v-if="reloadFlag" :is="Component" :key="route.fullPath" />
        </KeepAlive>
      </Transition>
    </template>
  </RouterView>
</template>
