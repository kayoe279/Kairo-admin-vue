<script setup lang="ts">
import { useAppStore } from "@/store";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { type RouteRecordRaw, useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const { breadcrumbsSetting } = storeToRefs(appStore);

const generator = (routerMap: RouteRecordRaw[]) => {
  return routerMap.map((item) => {
    const currentMenu = {
      ...item,
      label: item.meta?.title,
      key: item.name,
      disabled: item.path === "/"
    };
    if (item.children && item.children.length > 0) {
      currentMenu.children = generator(item.children);
    }
    return {
      ...currentMenu,
      children: currentMenu.children as any
    };
  });
};

const breadcrumbList = computed(() => {
  return generator(route.matched);
});

const dropdownSelect = (key) => {
  router.push({ name: key });
};
</script>

<template>
  <n-breadcrumb v-if="breadcrumbsSetting.show">
    <template
      v-for="routeItem in breadcrumbList"
      :key="routeItem.name === 'Redirect' ? void 0 : routeItem.name"
    >
      <n-breadcrumb-item v-if="routeItem.meta?.title">
        <n-dropdown
          v-if="routeItem.children?.length"
          :options="routeItem.children"
          @select="dropdownSelect"
        >
          <span class="inline">
            <component
              v-if="breadcrumbsSetting.showIcon && routeItem.meta?.icon"
              :is="routeItem.meta.icon"
              class="mr-px inline-block align-bottom text-lg"
            />
            {{ $t(`route.${routeItem.name}`, routeItem.meta.title) }}
          </span>
        </n-dropdown>
        <span v-else>
          <component
            v-if="breadcrumbsSetting.showIcon && routeItem.meta.icon"
            :is="routeItem.meta.icon"
          />
          {{ $t(`route.${routeItem.name}`, routeItem.meta.title) }}
        </span>
      </n-breadcrumb-item>
    </template>
  </n-breadcrumb>
</template>
