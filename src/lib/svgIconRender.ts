import SvgIcon from "@/components/ui/SvgIcon.vue";
import { h } from "vue";

interface IconConfig {
  /** Iconify icon name */
  icon?: string;
  /** Local icon name */
  localIcon?: string;
  /** Icon color */
  color?: string;
  /** Icon size */
  fontSize?: number;
}
type IconStyle = Partial<Pick<CSSStyleDeclaration, "color" | "fontSize">>;

export const svgIconRender = (config: IconConfig) => {
  const { color, fontSize, icon, localIcon } = config;

  const style: IconStyle = {};
  let className = "";

  if (color) {
    style.color = color;
  }

  if (fontSize) {
    // 将常见的fontSize值转换为Tailwind class
    const fontSizeMap: Record<number, string> = {
      12: "text-xs",
      14: "text-sm",
      16: "text-base",
      18: "text-lg",
      20: "text-xl",
      24: "text-2xl",
      30: "text-3xl",
      32: "text-3xl"
    };

    if (fontSizeMap[fontSize]) {
      className = fontSizeMap[fontSize];
    } else {
      // 对于不常见的fontSize值，仍然使用style
      style.fontSize = `${fontSize}px`;
    }
  }

  if (!icon && !localIcon) {
    return undefined;
  }

  const props: any = { icon, localIcon };
  if (Object.keys(style).length > 0) {
    props.style = style;
  }
  if (className) {
    props.class = className;
  }

  return () => h(SvgIcon, props);
};
