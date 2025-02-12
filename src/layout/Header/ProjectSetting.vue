<template>
  <NDrawer v-model:show="open" :width="360" :placement="state.placement">
    <NDrawerContent title="项目配置" :native-scrollbar="false" closable>
      <div class="drawer">
        <NDivider title-placement="center">主题</NDivider>
        <ThemeMode />

        <NDivider title-placement="center">布局模式</NDivider>
        <LayoutMode />

        <NDivider title-placement="center">主题颜色</NDivider>
        <ThemeColor />
        <div class="drawer-setting-item align-items-top">
          <span
            class="theme-item"
            v-for="(item, index) in state.appThemeList"
            :key="index"
            :style="{ 'background-color': item }"
            @click="togTheme(item)"
          >
            <NIcon size="12" v-if="item === designStore.themeColor">
              <CheckOutlined />
            </NIcon>
          </span>
        </div>

        <NDivider title-placement="center">界面功能</NDivider>

        <!-- <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">分割菜单</div>
          <div class="drawer-setting-item-action">
            <n-switch
              :disabled="settingStore.navMode !== 'horizontal-mix'"
              v-model:value="settingStore.menuSetting.mixMenu"
            />
          </div>
        </div> -->

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">固定顶栏</div>
          <div class="drawer-setting-item-action">
            <NSwitch v-model:value="settingStore.headerSetting.fixed" />
          </div>
        </div>

        <!--        <div class="drawer-setting-item">-->
        <!--          <div class="drawer-setting-item-title">-->
        <!--            固定侧边栏-->
        <!--          </div>-->
        <!--          <div class="drawer-setting-item-action">-->
        <!--            <n-switch v-model:value="settingStore.menuSetting.fixed" />-->
        <!--          </div>-->
        <!--        </div>-->

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">固定多页签</div>
          <div class="drawer-setting-item-action">
            <NSwitch v-model:value="settingStore.multiTabsSetting.fixed" />
          </div>
        </div>

        <NDivider title-placement="center">界面显示</NDivider>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">显示重载页面按钮</div>
          <div class="drawer-setting-item-action">
            <NSwitch v-model:value="settingStore.headerSetting.isReload" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">显示面包屑导航</div>
          <div class="drawer-setting-item-action">
            <NSwitch v-model:value="settingStore.crumbsSetting.show" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">显示面包屑显示图标</div>
          <div class="drawer-setting-item-action">
            <NSwitch v-model:value="settingStore.crumbsSetting.showIcon" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">显示多页签</div>
          <div class="drawer-setting-item-action">
            <NSwitch v-model:value="settingStore.multiTabsSetting.show" />
          </div>
        </div>
        <!--1.15废弃，没啥用，占用操作空间-->
        <!--        <div class="drawer-setting-item">-->
        <!--          <div class="drawer-setting-item-title"> 显示页脚 </div>-->
        <!--          <div class="drawer-setting-item-action">-->
        <!--            <n-switch v-model:value="settingStore.showFooter" />-->
        <!--          </div>-->
        <!--        </div>-->

        <NDivider title-placement="center">动画</NDivider>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">启用动画</div>
          <div class="drawer-setting-item-action">
            <NSwitch v-model:value="settingStore.isPageAnimate" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">动画类型</div>
          <div class="drawer-setting-item-select">
            <NSelect v-model:value="settingStore.pageAnimateType" :options="animateOptions" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <NAlert type="warning" :showIcon="false">
            <p>{{ state.alertText }}</p>
          </NAlert>
        </div>
      </div>
    </NDrawerContent>
  </NDrawer>
</template>

<script setup lang="ts">
import LayoutMode from "./components/LayoutMode/index.vue";
import ThemeColor from "./components/ThemeColor/index.vue";
import ThemeMode from "./components/ThemeMode/index.vue";
import { animates as animateOptions } from "@/settings/animateSetting";
import type { ProjectSettingProps } from "@/settings/projectSetting";
import { useDesignSettingStore } from "@/store/modules/designSetting";
import { useProjectSettingStore } from "@/store/modules/projectSetting";
import { CheckOutlined } from "@vicons/antd";
import type { DrawerPlacement } from "naive-ui";
import { storeToRefs } from "pinia";
import { computed, reactive, unref, watch } from "vue";

const settingStore = useProjectSettingStore();
const designStore = useDesignSettingStore();
const { open } = storeToRefs(settingStore);

const state = reactive({
  width: 360,
  title: "项目配置",
  placement: "right" as DrawerPlacement,
  alertText: "该功能主要实时预览各种布局效果，更多完整配置在 projectSetting.ts 中设置",
  appThemeList: designStore.appThemeList
});

// watch(
//   () => designStore.theme,
//   (to) => {
//     settingStore.setNavTheme(to === "dark" ? "dark" : "white");
//   }
// );

// const directionsOptions = computed(() => {
//   return animateOptions.find((item) => item.value == unref(settingStore.pageAnimateType));
// });

// const togNavTheme = (theme: string) => {
//   settingStore.navTheme = theme;
//   if (settingStore.navMode === "horizontal" && ["light"].includes(theme)) {
//     settingStore.setNavTheme("dark");
//   }
// };

const togTheme = (color: string) => {
  designStore.setThemeColor(color);
};

const togNavMode = (mode: ProjectSettingProps["navMode"]) => {
  settingStore.setNavMode(mode);
};

// 导出需要在模板中使用的变量和方法
// const { isDrawer, width, title, placement, alertText, appThemeList } = toRefs(state);
</script>

<style lang="less" scoped>
.drawer {
  .n-divider:not(.n-divider--vertical) {
    margin: 10px 0;
  }

  &-setting-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    flex-wrap: wrap;

    &-style {
      display: inline-block;
      position: relative;
      margin-right: 16px;
      cursor: pointer;
      text-align: center;
    }

    &-title {
      flex: 1 1;
      font-size: 14px;
    }

    &-action {
      flex: 0 0 auto;
    }

    &-select {
      flex: 1;
    }

    .theme-item {
      width: 20px;
      min-width: 20px;
      height: 20px;
      cursor: pointer;
      border: 1px solid #eee;
      border-radius: 2px;
      margin: 0 5px 5px 0;
      text-align: center;
      line-height: 14px;

      .n-icon {
        color: #fff;
      }
    }
  }

  .align-items-top {
    align-items: flex-start;
    padding: 2px 0;
  }

  .justify-center {
    justify-content: center;
  }

  .dark-switch .n-switch {
    ::v-deep(.n-switch__rail) {
      background-color: #000e1c;
    }
  }
}
</style>
