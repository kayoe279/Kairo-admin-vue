// app theme preset color
export const appThemeList: string[] = [
  "#34a0a4",
  "#00b4d8",
  "#0077b6",
  "#3b82f6",
  "#8b5cf6",
  "#9c27b0",
  "#FAAD14",
  "#ff9800",
  "#FC5404",
  "#F5222D",
  "#78DEC7",
  "#71EFA3",
  "#a7c957",
  "#22C55E"
];

export const themeSetting = {
  // 暗色侧边栏
  darkNav: false,
  // 灰度模式
  grayMode: false,
  //系统主题色
  themeColor: "#34a0a4",
  // 信息颜色
  infoColor: "#00b4d8",
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
