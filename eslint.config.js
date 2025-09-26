import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginVitest from "@vitest/eslint-plugin";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import {
  configureVueProject,
  defineConfigWithVueTs,
  vueTsConfigs
} from "@vue/eslint-config-typescript";
// import pluginTailwindcss from "eslint-plugin-tailwindcss";
import pluginVue from "eslint-plugin-vue";

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

configureVueProject({
  // Whether to parse TypeScript syntax in Vue templates.
  // Defaults to `true`.
  // Setting it to `false` could improve performance.
  // But TypeScript syntax in Vue templates will then lead to syntax errors.
  // Also, type-aware rules won't be applied to expressions in templates in that case.
  tsSyntaxInTemplates: true,

  // Optional: specify the script langs in `.vue` files
  // Defaults to `['ts']`.
  scriptLangs: [
    "ts",

    // [!DISCOURAGED]
    // Include 'js' to allow plain `<script>` or `<script setup>` blocks.
    // This might result-in false positive or negatives in some rules for `.vue` files.
    // Note you also need to configure `allowJs: true` and `checkJs: true`
    // in corresponding `tsconfig.json` files.
    "js",

    // [!STRONGLY DISCOURAGED]
    // Include 'tsx' to allow `<script lang="tsx">` blocks.
    // This would be in conflict with all type-aware rules.
    "tsx",

    // [!STRONGLY DISCOURAGED]
    // Include 'jsx' to allow `<script lang="jsx">` blocks.
    // This would be in conflict with all type-aware rules and may result in false positives.
    "jsx"
  ],

  // <https://github.com/vuejs/eslint-plugin-vue/issues/1910#issuecomment-1819993961>
  // Optional: the root directory to resolve the `.vue` files, defaults to `process.cwd()`.
  // You may need to set this to the root directory of your project if you have a monorepo.
  // This is useful when you allow any other languages than `ts` in `.vue` files.
  // Our config helper would resolve and parse all the `.vue` files under `rootDir`,
  // and only apply the loosened rules to the files that do need them.
  rootDir: import.meta.dirname
});

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
      ".local",
      ".vscode",
      ".idea",
      ".DS_Store",
      ".env"
    ]
  },

  ...pluginQuery.configs["flat/recommended"],

  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  // 还没有支持 tailwindcss 4.0
  // pluginTailwindcss.configs["flat/recommended"],

  {
    ...pluginVitest.configs.recommended,
    files: ["src/**/__tests__/*"]
  },

  {
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
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/triple-slash-reference": "off"
    }
  }
);
