<script lang="ts" setup>
import { useAppStore } from "@/store";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const appStore = useAppStore();
const { isPageAnimate, pageAnimateType } = storeToRefs(appStore);

const animateOptions = computed(() => [
  { value: "fade-slide", label: t("app.animation.fadeSlide") },
  { value: "fade", label: t("app.animation.fade") },
  { value: "fade-bottom", label: t("app.animation.fadeBottom") },
  { value: "fade-scale", label: t("app.animation.fadeScale") },
  { value: "zoom-fade", label: t("app.animation.zoomFade") },
  { value: "zoom-out", label: t("app.animation.zoomOut") }
]);
</script>

<template>
  <div class="space-y-4 py-3">
    <SettingItem :title="$t('app.animation.enable')">
      <n-switch v-model:value="isPageAnimate" />
    </SettingItem>
    <SettingItem :title="$t('app.animation.type')">
      <n-select
        v-model:value="pageAnimateType"
        :options="animateOptions"
        class="max-w-36 min-w-30"
      />
    </SettingItem>
  </div>
</template>
