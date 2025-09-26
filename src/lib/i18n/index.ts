import { i18n } from "@/plugins/i18n";
import type { NDateLocale, NLocale } from "naive-ui";
import { dateEnUS, dateZhCN, enUS, zhCN } from "naive-ui";

export function setI18nLocale(locale: Locale) {
  i18n.global.locale.value = locale;
}

export const locales = ["zh-CN", "en-US"];

export const $t = i18n.global.t;

export const naiveI18nOptions: Record<
  Locale,
  { locale: NLocale | null; dateLocale: NDateLocale | null }
> = {
  "zh-CN": {
    locale: zhCN,
    dateLocale: dateZhCN
  },
  "en-US": {
    locale: enUS,
    dateLocale: dateEnUS
  }
};
