export const dynamicRoutes: AppRoute.DynamicRouteRecordRaw[] = [
  {
    path: "/dashboard",
    name: "dashboard",
    redirect: "/dashboard/console",
    component: "/Layout.vue",
    meta: {
      title: "Dashboard",
      icon: "ant-design:dashboard-outlined",
      sort: 0
    },
    children: [
      {
        path: "/dashboard/console",
        name: "dashboard-console",
        meta: {
          title: "主控台",
          affix: true
        },
        component: "/dashboard/console/console.vue"
      },
      {
        path: "/dashboard/monitor",
        name: "dashboard-monitor",
        meta: {
          title: "监控页"
        },
        component: "/dashboard/monitor/monitor.vue"
      },
      {
        path: "/dashboard/workplace",
        name: "dashboard-workplace",
        meta: {
          title: "工作台",
          keepAlive: true
        },
        component: "/dashboard/workplace/workplace.vue"
      }
    ]
  },
  {
    path: "/list",
    name: "List",
    redirect: "/list/basic-list",
    component: "/Layout.vue",
    meta: {
      title: "列表页面",
      icon: "solar:checklist-minimalistic-outline",
      sort: 1
    },
    children: [
      {
        path: "/list/basic-list",
        name: "list-basic-list",
        meta: {
          title: "基础列表"
        },
        component: "/list/basicList/index.vue"
      },
      {
        path: "/list/basic-info/:id?",
        name: "list-basic-info",
        meta: {
          title: "基础详情",
          hidden: true
        },
        component: "/list/basicList/info.vue"
      }
    ]
  },
  {
    path: "/exception",
    name: "exception",
    redirect: "/exception/403",
    component: "/Layout.vue",
    meta: {
      title: "异常页面",
      icon: "solar:confounded-circle-broken",
      sort: 2
    },
    children: [
      {
        path: "/exception/403",
        name: "exception-403",
        meta: {
          title: "403"
        },
        component: "/exception/403.vue"
      },
      {
        path: "/exception/404",
        name: "exception-404",
        meta: {
          title: "404"
        },
        component: "/exception/404.vue"
      },
      {
        path: "/exception/500",
        name: "exception-500",
        meta: {
          title: "500"
        },
        component: "/exception/500.vue"
      }
    ]
  },
  {
    path: "/form",
    name: "form",
    redirect: "/form/basic-form",
    component: "/Layout.vue",
    meta: {
      title: "表单页面",
      icon: "solar:document-add-broken",
      sort: 3
    },
    children: [
      {
        path: "/form/basic-form",
        name: "form-basic-form",
        meta: {
          title: "基础表单"
        },
        component: "/form/basicForm/index.vue"
      },
      {
        path: "/form/step-form",
        name: "form-step-form",
        meta: {
          title: "分步表单"
        },
        component: "/form/stepForm/stepForm.vue"
      },
      {
        path: "/form/detail",
        name: "form-detail",
        meta: {
          title: "表单详情"
        },
        component: "/form/detail/index.vue"
      }
    ]
  },
  {
    path: "/result",
    name: "result",
    redirect: "/result/success",
    component: "/Layout.vue",
    meta: {
      title: "结果页面",
      icon: "solar:emoji-funny-circle-linear",
      sort: 4
    },
    children: [
      {
        path: "/result/success",
        name: "result-success",
        meta: {
          title: "成功页"
        },
        component: "/result/success.vue"
      },
      {
        path: "/result/fail",
        name: "result-fail",
        meta: {
          title: "失败页"
        },
        component: "/result/fail.vue"
      },
      {
        path: "/result/info",
        name: "result-info",
        meta: {
          title: "信息页"
        },
        component: "/result/info.vue"
      }
    ]
  },
  {
    path: "/comp",
    name: "comp",
    component: "/Layout.vue",
    redirect: "/comp/table",
    meta: {
      title: "组件示例",
      icon: "proicons:component",
      sort: 6
    },
    children: [
      {
        path: "/comp/table",
        name: "comp-table",
        redirect: "/comp/table/basic",
        meta: {
          title: "表格"
        },
        children: [
          {
            path: "/comp/table/basic",
            name: "comp-table-basic",
            meta: {
              title: "基础表格"
            },
            component: "/comp/table/basic.vue"
          },
          {
            path: "/comp/table/editCell",
            name: "comp-table-editCell",
            meta: {
              title: "单元格编辑"
            },
            component: "/comp/table/editCell.vue"
          },
          {
            path: "/comp/table/editRow",
            name: "comp-table-editRow",
            meta: {
              title: "整行编辑"
            },
            component: "/comp/table/editRow.vue"
          }
        ]
      },
      {
        path: "/comp/form",
        name: "comp-form",
        redirect: "/comp/form/basic",
        meta: {
          title: "表单"
        },
        children: [
          {
            path: "/comp/form/basic",
            name: "comp-form-basic",
            meta: {
              title: "基础使用"
            },
            component: "/comp/form/basic.vue"
          },
          {
            path: "/comp/form/useForm",
            name: "comp-form-useForm",
            meta: {
              title: "useForm"
            },
            component: "/comp/form/useForm.vue"
          }
        ]
      },
      {
        path: "/comp/upload",
        name: "comp-upload",
        meta: {
          title: "上传图片"
        },
        component: "/comp/upload/index.vue"
      },
      {
        path: "/comp/modal",
        name: "comp-modal",
        meta: {
          title: "弹窗扩展"
        },
        component: "/comp/modal/index.vue"
      },
      {
        path: "/comp/richtext",
        name: "comp-richtext",
        meta: {
          title: "富文本"
        },
        component: "/comp/richtext/vue-quill.vue"
      },
      {
        path: "/comp/drag",
        name: "comp-drag",
        meta: {
          title: "拖拽"
        },
        component: "/comp/drag/index.vue"
      }
    ]
  },
  {
    path: "/frame",
    name: "frame",
    redirect: "/frame/docs",
    component: "/Layout.vue",
    meta: {
      title: "外部页面",
      sort: 7,
      icon: "solar:euro-broken"
    },
    children: [
      {
        path: "/frame/naive-admin",
        name: "frame-naive-admin",
        meta: {
          title: "NaiveAdmin",
          href: "https://www.naiveadmin.com"
        },
        component: "/iframe/index.vue"
      },
      {
        path: "/frame/docs",
        name: "frame-docs",
        meta: {
          title: "项目文档(内嵌)",
          href: "https://jekip.github.io/docs"
        },
        component: "/iframe/index.vue"
      },
      {
        path: "/frame/naive",
        name: "frame-naive",
        meta: {
          title: "NaiveUi(内嵌)",
          href: "https://www.naiveui.com"
        },
        component: "/iframe/index.vue"
      }
    ]
  },
  {
    path: "/setting",
    name: "setting",
    redirect: "/setting/account",
    component: "/Layout.vue",
    meta: {
      title: "设置页面",
      icon: "solar:settings-outline",
      sort: 8
    },
    children: [
      {
        path: "/setting/menu",
        name: "setting-menu",
        meta: {
          title: "菜单权限"
        },
        component: "/setting/menu/menu.vue"
      },
      {
        path: "/setting/role",
        name: "setting-role",
        meta: {
          title: "角色权限"
        },
        component: "/setting/role/role.vue"
      },
      {
        path: "/setting/account",
        name: "setting-account",
        meta: {
          title: "个人设置"
        },
        component: "/setting/account/account.vue"
      },
      {
        path: "/setting/system",
        name: "setting-system",
        meta: {
          title: "系统设置"
        },
        component: "/setting/system/system.vue"
      }
    ]
  },
  {
    path: "/directive",
    name: "directive",
    component: "/Layout.vue",
    redirect: "/directive/index",
    meta: {
      sort: 9,
      isRoot: true,
      icon: "solar:compass-broken"
    },
    children: [
      {
        path: "/directive/index",
        name: "directive-index",
        meta: {
          title: "指令示例"
        },
        component: "/directive/index.vue"
      }
    ]
  },
  {
    path: "/about",
    name: "about",
    component: "/Layout.vue",
    redirect: "/about/index",
    meta: {
      sort: 10,
      isRoot: true,
      icon: "ix:about"
    },
    children: [
      {
        path: "/about/index",
        name: "about-index",
        meta: {
          title: "关于项目"
        },
        component: "/about/index.vue"
      }
    ]
  }
];
