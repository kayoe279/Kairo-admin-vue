import path from "node:path";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import type { PluginOption } from "vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

export function setupUnplugin() {
  const plugins: PluginOption[] = [
    // 按需引入NaiveUi且自动创建组件声明
    Components({
      dts: "src/types/components.d.ts",
      dirs: ["src/components", "src/layouts"],
      resolvers: [NaiveUiResolver()]
    }),
    // 创建svg图标
    createSvgIconsPlugin({
      iconDirs: [path.resolve(__dirname, "src/assets/icons/")],
      symbolId: "icon-[dir]-[name]"
    })
  ];

  return plugins;
}
