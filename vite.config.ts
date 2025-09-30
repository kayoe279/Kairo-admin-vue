import { wrapperEnv } from "./build/utils";
import { setupVitePlugins } from "./build/vite/plugin";
import { createProxy } from "./build/vite/proxy";
import pkg from "./package.json";
import { format } from "date-fns";
import path from "node:path";
import type { ConfigEnv } from "vite";
import { defineConfig, loadEnv } from "vite";

const { dependencies, devDependencies, name, version, author } = pkg;

const appInfo = {
  pkg: { dependencies, devDependencies, name, version, author },
  lastBuildTime: format(new Date(), "yyyy-MM-dd HH:mm:ss")
};

export default defineConfig(({ command, mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd());
  const viteEnv = wrapperEnv(env);
  const { VITE_PUBLIC_PATH, VITE_PORT, VITE_PROXY } = viteEnv;
  const isBuild = command === "build";

  return {
    base: VITE_PUBLIC_PATH,
    esbuild: {},
    resolve: {
      alias: {
        "~": `${path.resolve(__dirname)}/`,
        "@": `${path.resolve(__dirname, "src")}/`
      }
    },
    plugins: setupVitePlugins(viteEnv, isBuild),
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
      appInfo: JSON.stringify(appInfo),
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    },
    server: {
      host: true,
      port: 8000,
      proxy: createProxy(VITE_PROXY)
    },
    build: {
      target: "es2015",
      cssTarget: "chrome80",
      outDir: "dist",
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          // 优化代码分割
          manualChunks: {
            // 将 Vue 相关库打包到一个 chunk
            vue: ["vue", "vue-router", "pinia"],
            // 将 UI 库单独打包
            "naive-ui": ["naive-ui"],
            // 将工具库单独打包
            utils: ["lodash-es", "date-fns", "clsx"],
            // 将图表库单独打包
            charts: ["echarts", "vue-echarts"],
            // 将认证相关库单独打包
            auth: ["@supabase/supabase-js", "@tanstack/vue-query"]
          },
          // 优化 chunk 文件名
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? (chunkInfo.facadeModuleId
                  .split("/")
                  .pop()
                  ?.replace(/\.\w+$/, "") ?? "chunk")
              : "chunk";
            return `assets/${facadeModuleId}-[hash].js`;
          }
        }
      }
    },

    // https://github.com/vitest-dev/vitest
    test: {
      include: ["test/**/*.test.ts"],
      environment: "jsdom"
    }
  };
});
