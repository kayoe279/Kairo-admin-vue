import pluginVitest from "@vitest/eslint-plugin";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import pluginPlaywright from "eslint-plugin-playwright";
// import pluginTailwindcss from "eslint-plugin-tailwindcss";
import pluginVue from "eslint-plugin-vue";

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"]
  },

  {
    name: "app/files-to-ignore",
    ignores: [
      "**/dist/**",
      "**/dist-ssr/**",
      "**/coverage/**",
      "node_modules/**",
      "components.d.ts",
      ".husky",
      ".local"
    ]
  },

  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  // 还没有支持 tailwindcss 4.0
  // pluginTailwindcss.configs["flat/recommended"],

  {
    ...pluginVitest.configs.recommended,
    files: ["src/**/__tests__/*"]
  },

  {
    ...pluginPlaywright.configs["flat/recommended"],
    files: ["e2e/**/*.{test,spec}.{js,ts,jsx,tsx}"]
  },
  skipFormatting,

  {
    rules: {
      "no-console":
        process.env.NODE_ENV === "production"
          ? [
              "error",
              {
                allow: ["warn", "error"]
              }
            ]
          : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
      "no-prototype-builtins": "off",
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-duplicate-enum-values": "off",
      "prefer-rest-params": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/consistent-type-imports": "off"
    }
  }
);
