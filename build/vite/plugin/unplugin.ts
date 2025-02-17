import path from "node:path";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import Icons from "unplugin-icons/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import type { PluginOption } from "vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

export function setupUnplugin(viteEnv: ViteEnv) {
  const { VITE_ICON_LOCAL_PREFIX, VITE_ICON_PREFIX } = viteEnv;

  const localIconPath = path.join(process.cwd(), "src/assets/icons");
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, "");

  const plugins: PluginOption[] = [
    Icons({
      compiler: "vue3",
      customCollections: {
        [collectionName]: FileSystemIconLoader(localIconPath, (svg) =>
          svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
        )
      },
      scale: 1,
      defaultClass: "inline-block"
    }),
    // 按需引入NaiveUi且自动创建组件声明
    Components({
      dts: "src/types/components.d.ts",
      dirs: ["src/components", "src/layouts"],
      resolvers: [NaiveUiResolver()]
    }),
    // 创建svg图标
    createSvgIconsPlugin({
      iconDirs: [localIconPath],
      symbolId: `${VITE_ICON_LOCAL_PREFIX}-[dir]-[name]`,
      inject: "body-last",
      customDomId: "__SVG_ICON_LOCAL__"
    })
  ];

  return plugins;
}
