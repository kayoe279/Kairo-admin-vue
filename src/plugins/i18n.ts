import { getCurrentLocale } from "@/lib/storage";
import type { App } from "vue";
import { createI18n } from "vue-i18n";
import enUS from "~/locales/en-US.json";
import zhCN from "~/locales/zh-CN.json";

const defaultLocale = import.meta.env.VITE_DEFAULT_LOCALE;

export const i18n = createI18n({
  legacy: false,
  locale: getCurrentLocale() || defaultLocale, // 默认显示语言
  fallbackLocale: defaultLocale,
  messages: {
    "zh-CN": zhCN,
    "en-US": enUS
  }
});

export const setupI18n = (app: App<Element>) => {
  app.use(i18n);
};
