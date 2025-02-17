import SvgIcon from "@/components/atoms/SvgIcon.vue";
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

  if (color) {
    style.color = color;
  }
  if (fontSize) {
    style.fontSize = `${fontSize}px`;
  }

  if (!icon && !localIcon) {
    return undefined;
  }

  return () => h(SvgIcon, { icon, localIcon, style });
};
