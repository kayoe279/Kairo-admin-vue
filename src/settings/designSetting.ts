// app theme preset color
export const appThemeList: string[] = [
  "#009688",
  "#00b4d8",
  "#0077b6",
  "#34a0a4",
  "#a7c957",
  "#6a994e",
  "#ee4f12",
  "#0096c7",
  "#9c27b0",
  "#ff9800",
  "#FF3D68",
  "#00C1D4",
  "#71EFA3",
  "#ef233c",
  "#78DEC7",
  "#1768AC",
  "#FB9300",
  "#FC5404"
];

const setting = {
  theme: "light" as "light" | "dark",
  //系统主题色
  themeColor: "#009688",
  //系统内置主题色列表
  appThemeList,
  // 暗色侧边栏
  darkNav: false,
  // 灰度模式
  grayMode: false
};

export type DesignSettingProps = typeof setting;

export default setting;
