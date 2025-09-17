// app theme preset color
export const appThemeList: string[] = [
  "#00b4d8",
  "#a78bfa", // 柔紫
  "#2563eb", // 科技蓝
  "#6366f1", // 紫蓝
  "#f97316", // 橙色
  "#ef4444", // 红色
  "#0ea5e9", // 青蓝
  "#15803d", // 深绿
  "#22c55e", // 主绿
  "#4f46e5", // 深紫
  "#38bdf8", // 天蓝
  "#8B5CF6", // 电紫
  "#EC4899", // 粉红
  "#F5222D", // 红
  "#06B6D4", // 青蓝
  "#F9A8D4", // 粉
  "#FCD34D", // 黄
  "#FAAD14", // 橙
  "#6EE7B7", // 薄荷绿
  "#93C5FD" // 天蓝
];

export const themeSetting = {
  // 暗色侧边栏
  darkNav: false,
  // 灰度模式
  grayMode: false,
  //系统主题色
  primaryColor: appThemeList[0],
  // 信息颜色
  infoColor: "#0ea5e9",
  // 成功颜色
  successColor: "#22C55E",
  // 警告颜色
  warningColor: "#FAAD14",
  // 错误颜色
  errorColor: "#F5222D",
  //系统内置主题色列表
  appThemeList
};

export type ThemeSettingProps = typeof themeSetting;
