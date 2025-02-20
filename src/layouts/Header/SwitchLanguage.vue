<script lang="ts" setup>
import { locales } from "@/lib/i18n";
import { useAppStore } from "@/store";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const appStore = useAppStore();

const localeOptions = computed(() =>
  locales.map((locale) => ({
    label: t(`app.${locale}`),
    key: locale
  }))
);

const onSelect = (key: Locale) => {
  appStore.setLocale(key);
};
</script>

<template>
  <n-dropdown trigger="hover" :value="appStore.locale" @select="onSelect" :options="localeOptions">
    <ButtonIcon icon="heroicons:language" hideTooltip />
  </n-dropdown>
</template>
