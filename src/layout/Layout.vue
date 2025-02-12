<template>
  <NLayout :position="fixedMenu" has-sider>
    <NLayoutSider
      v-show="showMenu"
      show-trigger="bar"
      @collapse="collapsed = true"
      @expand="collapsed = false"
      :collapsed="collapsed"
      collapse-mode="width"
      :collapsed-width="64"
      :width="leftMenuWidth"
      :native-scrollbar="false"
      :inverted="inverted || darkNav"
      class="!z-[12] !shadow-xs !transition-all duration-200 ease-in-out"
    >
      <Logo :collapsed="collapsed" />
      <AsideMenu v-model:collapsed="collapsed" v-model:location="getMenuLocation" />
    </NLayoutSider>

    <NDrawer v-model:show="showSideDrawer" :width="menuWidth" :placement="'left'">
      <NLayoutSider
        :position="fixedMenu"
        :collapsed="false"
        :width="menuWidth"
        :native-scrollbar="false"
        :inverted="inverted || darkNav"
      >
        <Logo :collapsed="collapsed" />
        <AsideMenu v-model:location="getMenuLocation" />
      </NLayoutSider>
    </NDrawer>

    <NLayout :inverted="inverted">
      <NLayoutHeader :inverted="inverted" :position="fixedHeader" class="!z-10">
        <PageHeader v-model:collapsed="collapsed" />
      </NLayoutHeader>

      <NLayout
        :class="
          cn(
            '!bg-background-root relative h-screen pt-16 !transition-all duration-200 ease-in-out',
            {
              'pt-16': fixedMulti,
              'pt-0': fixedHeader === 'static'
            }
          )
        "
        :native-scrollbar="false"
      >
        <TagsView v-if="isMultiTabs" v-model:collapsed="collapsed" />
        <div
          :class="
            cn('px-4', {
              'pt-11': fixedMulti,
              'pt-0': !isMultiTabs,
              'pt-3': !isMultiTabs
            })
          "
        >
          <MainView />
        </div>
      </NLayout>
      <NBackTop :right="100" />
    </NLayout>
  </NLayout>
</template>

<script lang="ts" setup>
import PageHeader from "@/layout/Header/index.vue";
import Logo from "@/layout/Logo/index.vue";
import MainView from "@/layout/Main/index.vue";
import AsideMenu from "@/layout/Menu/index.vue";
import TagsView from "@/layout/TagsView/index.vue";
import { cn } from "@/lib/utils";
import { useDesignSettingStore } from "@/store/modules/designSetting";
import { useProjectSettingStore } from "@/store/modules/projectSetting";
import { NLayoutHeader } from "naive-ui";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, unref } from "vue";
import { useRoute } from "vue-router";

const currentRoute = useRoute();

const settingStore = useProjectSettingStore();
const designStore = useDesignSettingStore();
const { inverted, darkNav } = storeToRefs(designStore);
const { navMode, headerSetting, menuSetting, multiTabsSetting } = storeToRefs(settingStore);

const collapsed = ref<boolean>(false);

const { mobileWidth, menuWidth } = unref(menuSetting);

const isMobile = computed<boolean>({
  get: () => settingStore.isMobile,
  set: (val) => settingStore.setIsMobile(val)
});

const fixedHeader = computed(() => {
  const { fixed } = unref(headerSetting);
  return fixed ? "absolute" : "static";
});

const showMenu = computed(() => {
  const hideMixMenuSub = navMode.value === "horizontal-mix" && !currentRoute.meta.isRoot;
  return !isMobile.value && (navMode.value === "vertical" || hideMixMenuSub);
});

const fixedMenu = computed(() => {
  const { fixed } = unref(headerSetting);
  return fixed ? "absolute" : "static";
});

const isMultiTabs = computed(() => {
  return unref(multiTabsSetting).show;
});

const fixedMulti = computed(() => {
  return unref(multiTabsSetting).fixed;
});

const leftMenuWidth = computed(() => {
  const { minMenuWidth, menuWidth } = unref(menuSetting);
  return collapsed.value ? minMenuWidth : menuWidth;
});

const getMenuLocation = computed(() => {
  return unref(navMode) === "horizontal" ? "header" : "left";
});

// 控制显示或隐藏移动端侧边栏
const showSideDrawer = computed({
  get: () => isMobile.value && collapsed.value,
  set: (val) => (collapsed.value = val)
});

//判断是否触发移动端模式
const checkMobileMode = () => {
  if (document.body.clientWidth <= mobileWidth) {
    isMobile.value = true;
  } else {
    isMobile.value = false;
  }
  collapsed.value = false;
};

const watchWidth = () => {
  const Width = document.body.clientWidth;
  if (Width <= 950) {
    collapsed.value = true;
  } else collapsed.value = false;

  checkMobileMode();
};

onMounted(() => {
  checkMobileMode();
  window.addEventListener("resize", watchWidth);
});
</script>
