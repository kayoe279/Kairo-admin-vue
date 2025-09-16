// import { configCompressPlugin } from "./compress";
import { configHtmlPlugin } from "./html";
import { setupUnplugin } from "./unplugin";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import type { PluginOption } from "vite";
import progress from "vite-plugin-progress";
import VueDevtools from "vite-plugin-vue-devtools";

export function setupVitePlugins(viteEnv: ImportMetaEnv, isBuild: boolean) {
  const vitePlugins: PluginOption[] = [
    vue(),
    vueJsx(),

    tailwindcss(),

    // 开发工具
    VueDevtools(),

    // 打包时候的进度条
    progress(),

    // 引入unplugin
    ...setupUnplugin(viteEnv),

    // vite-plugin-html
    configHtmlPlugin(viteEnv, isBuild)
  ];

  return vitePlugins;
}
