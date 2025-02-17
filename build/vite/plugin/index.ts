import { configCompressPlugin } from "./compress";
import { configHtmlPlugin } from "./html";
import { setupUnplugin } from "./unplugin";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import type { PluginOption } from "vite";
import progress from "vite-plugin-progress";
import VueDevtools from "vite-plugin-vue-devtools";

export function setupVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const { VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE } = viteEnv;

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

  if (isBuild) {
    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE)
    );
  }

  return vitePlugins;
}
