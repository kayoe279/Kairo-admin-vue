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
      port: VITE_PORT,
      proxy: createProxy(VITE_PROXY)
    },
    build: {
      target: "es2015",
      cssTarget: "chrome80",
      outDir: "dist",
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000
    },

    // https://github.com/vitest-dev/vitest
    test: {
      include: ["test/**/*.test.ts"],
      environment: "jsdom"
    }
  };
});
