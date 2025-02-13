const setting = {
  //导航模式 vertical 左侧菜单模式 horizontal 顶部菜单模式 horizontal-mix 顶部菜单混合模式
  navMode: "vertical" as "vertical" | "horizontal" | "horizontal-mix",
  //导航风格 dark 暗色侧边栏 light 白色侧边栏 header-dark 暗色顶栏
  navTheme: "light",
  //顶部
  headerSetting: {
    //固定顶部和页签
    fixed: true,
    //顶部高度
    height: 64,
    //显示重载按钮
    isReload: true
  },
  //页脚
  showFooter: true,
  //多标签
  multiTabsSetting: {
    height: 44,
    //是否显示
    show: true
  },
  //菜单
  menuSetting: {
    //最小宽度
    minMenuWidth: 64,
    //菜单宽度
    menuWidth: 200,
    //触发移动端侧边栏的宽度
    mobileWidth: 768
  },
  //面包屑
  breadcrumbsSetting: {
    //是否显示
    show: true,
    //显示图标
    showIcon: false
  },
  //菜单权限模式 FIXED 前端固定路由  BACK 动态获取
  permissionMode: "FIXED",
  //是否开启路由动画
  isPageAnimate: true,
  //路由动画类型
  pageAnimateType: "zoom-fade"
};

export type AppSettingProps = typeof setting;
export default setting;
