export const routeConfig = [
  // Dashboard - 仪表盘
  {
    path: "/dashboard",
    name: "dashboard",
    redirect: "/dashboard/workplace",
    component: "/Layout.vue",
    meta: {
      title: "仪表盘",
      icon: "solar:chart-square-broken",
      sort: 0
    },
    children: [
      {
        path: "/dashboard/workplace",
        name: "dashboard-workplace",
        meta: {
          title: "工作台",
          keepAlive: true,
          affix: true
        },
        component: "/dashboard/workplace.vue"
      },
      {
        path: "/dashboard/analysis",
        name: "dashboard-analysis",
        meta: {
          title: "数据分析",
          keepAlive: true
        },
        component: "/dashboard/analysis.vue"
      },
      {
        path: "/dashboard/monitor",
        name: "dashboard-monitor",
        meta: {
          title: "实时监控"
        },
        component: "/dashboard/monitor.vue"
      }
    ]
  },

  // Examples - 组件示例
  {
    path: "/examples",
    name: "examples",
    redirect: "/examples/form",
    component: "/Layout.vue",
    meta: {
      title: "组件示例",
      icon: "solar:code-square-broken",
      sort: 1
    },
    children: [
      // 表单示例 - 三级路由
      {
        path: "/examples/form",
        name: "examples-form",
        redirect: "/examples/form/basic",
        meta: {
          title: "表单示例"
        },
        children: [
          {
            path: "/examples/form/basic",
            name: "examples-form-basic",
            meta: {
              title: "基础表单"
            },
            component: "/examples/form/basic.vue"
          },
          {
            path: "/examples/form/advanced",
            name: "examples-form-advanced",
            meta: {
              title: "高级表单"
            },
            component: "/examples/form/advanced.vue"
          },
          {
            path: "/examples/form/step",
            name: "examples-form-step",
            meta: {
              title: "分步表单"
            },
            component: "/examples/form/step.vue"
          },
          {
            path: "/examples/form/validation",
            name: "examples-form-validation",
            meta: {
              title: "表单验证"
            },
            component: "/examples/form/validation.vue"
          }
        ]
      },
      // 表格示例 - 三级路由
      {
        path: "/examples/table",
        name: "examples-table",
        redirect: "/examples/table/basic",
        meta: {
          title: "表格示例"
        },
        children: [
          {
            path: "/examples/table/basic",
            name: "examples-table-basic",
            meta: {
              title: "基础表格"
            },
            component: "/examples/table/basic.vue"
          },
          {
            path: "/examples/table/advanced",
            name: "examples-table-advanced",
            meta: {
              title: "高级表格"
            },
            component: "/examples/table/advanced.vue"
          },
          {
            path: "/examples/table/editable",
            name: "examples-table-editable",
            meta: {
              title: "可编辑表格"
            },
            component: "/examples/table/editable.vue"
          },
          {
            path: "/examples/table/virtual",
            name: "examples-table-virtual",
            meta: {
              title: "虚拟滚动表格"
            },
            component: "/examples/table/virtual.vue"
          }
        ]
      },
      // 其他组件示例
      {
        path: "/examples/chart",
        name: "examples-chart",
        meta: {
          title: "图表示例"
        },
        component: "/examples/chart.vue"
      },
      {
        path: "/examples/upload",
        name: "examples-upload",
        meta: {
          title: "文件上传"
        },
        component: "/examples/upload.vue"
      },
      {
        path: "/examples/richtext",
        name: "examples-richtext",
        meta: {
          title: "富文本"
        },
        component: "/examples/richtext.vue"
      },
      {
        path: "/examples/drag",
        name: "examples-drag",
        meta: {
          title: "拖拽"
        },
        component: "/examples/drag.vue"
      },
      {
        path: "/examples/directive",
        name: "examples-directive",
        meta: {
          title: "指令示例"
        },
        component: "/examples/directive.vue"
      }
    ]
  },

  // Business - 业务管理
  {
    path: "/business",
    name: "business",
    redirect: "/business/product",
    component: "/Layout.vue",
    meta: {
      title: "业务管理",
      icon: "solar:shop-broken",
      sort: 2
    },
    children: [
      // 商品管理 - 三级路由示例
      {
        path: "/business/product",
        name: "business-product",
        redirect: "/business/product/list",
        meta: {
          title: "商品管理"
        },
        children: [
          {
            path: "/business/product/list",
            name: "business-product-list",
            meta: {
              title: "商品列表"
            },
            component: "/business/product/list.vue"
          },
          {
            path: "/business/product/detail/:id?",
            name: "business-product-detail",
            meta: {
              title: "商品详情",
              hidden: true
            },
            component: "/business/product/detail.vue"
          },
          // 商品分类 - 三级路由
          {
            path: "/business/product/category",
            name: "business-product-category",
            redirect: "/business/product/category/list",
            meta: {
              title: "商品分类"
            },
            children: [
              {
                path: "/business/product/category/list",
                name: "business-product-category-list",
                meta: {
                  title: "分类列表"
                },
                component: "/business/product/category/list.vue"
              },
              {
                path: "/business/product/category/detail/:id?",
                name: "business-product-category-detail",
                meta: {
                  title: "分类详情",
                  hidden: true
                },
                component: "/business/product/category/detail.vue"
              }
            ]
          },
          {
            path: "/business/product/brand",
            name: "business-product-brand",
            meta: {
              title: "品牌管理"
            },
            component: "/business/product/brand.vue"
          },
          {
            path: "/business/product/inventory",
            name: "business-product-inventory",
            meta: {
              title: "库存管理"
            },
            component: "/business/product/inventory.vue"
          }
        ]
      },
      // 订单管理
      {
        path: "/business/order",
        name: "business-order",
        redirect: "/business/order/list",
        meta: {
          title: "订单管理"
        },
        children: [
          {
            path: "/business/order/list",
            name: "business-order-list",
            meta: {
              title: "订单列表"
            },
            component: "/business/order/list.vue"
          },
          {
            path: "/business/order/detail/:id",
            name: "business-order-detail",
            meta: {
              title: "订单详情",
              hidden: true
            },
            component: "/business/order/detail.vue"
          },
          {
            path: "/business/order/refund",
            name: "business-order-refund",
            meta: {
              title: "退款管理"
            },
            component: "/business/order/refund.vue"
          },
          {
            path: "/business/order/shipping",
            name: "business-order-shipping",
            meta: {
              title: "物流管理"
            },
            component: "/business/order/shipping.vue"
          }
        ]
      },
      // 客户管理
      {
        path: "/business/customer",
        name: "business-customer",
        redirect: "/business/customer/list",
        meta: {
          title: "客户管理"
        },
        children: [
          {
            path: "/business/customer/list",
            name: "business-customer-list",
            meta: {
              title: "客户列表"
            },
            component: "/business/customer/list.vue"
          },
          {
            path: "/business/customer/detail/:id",
            name: "business-customer-detail",
            meta: {
              title: "客户详情",
              hidden: true
            },
            component: "/business/customer/detail.vue"
          },
          {
            path: "/business/customer/group",
            name: "business-customer-group",
            meta: {
              title: "客户分组"
            },
            component: "/business/customer/group.vue"
          },
          {
            path: "/business/customer/service",
            name: "business-customer-service",
            meta: {
              title: "客服记录"
            },
            component: "/business/customer/service.vue"
          }
        ]
      }
    ]
  },

  // Exception - 异常页面
  {
    path: "/exception",
    name: "exception",
    redirect: "/exception/403",
    component: "/Layout.vue",
    meta: {
      title: "异常页面",
      icon: "solar:confounded-circle-broken",
      sort: 4
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

  // Permissions - 权限管理
  {
    path: "/permissions",
    name: "permissions",
    redirect: "/permissions/example",
    component: "/Layout.vue",
    meta: {
      title: "权限管理",
      icon: "solar:shield-user-broken",
      sort: 5
    },
    children: [
      {
        path: "/permissions/example",
        name: "permissions-example",
        meta: {
          title: "权限示例"
        },
        component: "/permissions/example.vue"
      },
      {
        path: "/permissions/super",
        name: "permissions-super",
        meta: {
          title: "超级权限",
          roles: ["super"]
        },
        component: "/permissions/super.vue"
      }
    ]
  },

  // System - 系统管理
  {
    path: "/system",
    name: "system",
    redirect: "/system/user",
    component: "/Layout.vue",
    meta: {
      title: "系统管理",
      icon: "solar:settings-minimalistic-broken",
      sort: 6
    },
    children: [
      // 用户管理
      {
        path: "/system/user",
        name: "system-user",
        redirect: "/system/user/list",
        meta: {
          title: "用户管理"
        },
        children: [
          {
            path: "/system/user/list",
            name: "system-user-list",
            meta: {
              title: "用户列表"
            },
            component: "/system/user/list.vue"
          },
          {
            path: "/system/user/detail/:id",
            name: "system-user-detail",
            meta: {
              title: "用户详情",
              hidden: true
            },
            component: "/system/user/detail.vue"
          }
        ]
      },
      // 角色管理 - 二级路由
      {
        path: "/system/role",
        name: "system-role",
        redirect: "/system/role/list",
        meta: {
          title: "角色管理"
        },
        children: [
          {
            path: "/system/role/list",
            name: "system-role-list",
            meta: {
              title: "角色列表"
            },
            component: "/system/role/list.vue"
          },
          {
            path: "/system/role/detail/:id",
            name: "system-role-detail",
            meta: {
              title: "角色详情",
              hidden: true
            },
            component: "/system/role/detail.vue"
          },
          {
            path: "/system/role/permissions/:id",
            name: "system-role-permissions",
            meta: {
              title: "角色权限",
              hidden: true
            },
            component: "/system/role/permissions.vue"
          }
        ]
      },
      // 菜单管理
      {
        path: "/system/menu",
        name: "system-menu",
        redirect: "/system/menu/list",
        meta: {
          title: "菜单管理"
        },
        children: [
          {
            path: "/system/menu/list",
            name: "system-menu-list",
            meta: {
              title: "菜单列表"
            },
            component: "/system/menu/list.vue"
          },
          {
            path: "/system/menu/detail/:id?",
            name: "system-menu-detail",
            meta: {
              title: "菜单详情",
              hidden: true
            },
            component: "/system/menu/detail.vue"
          }
        ]
      },
      // 部门管理
      {
        path: "/system/dept",
        name: "system-dept",
        redirect: "/system/dept/list",
        meta: {
          title: "部门管理"
        },
        children: [
          {
            path: "/system/dept/list",
            name: "system-dept-list",
            meta: {
              title: "部门列表"
            },
            component: "/system/dept/list.vue"
          },
          {
            path: "/system/dept/detail/:id?",
            name: "system-dept-detail",
            meta: {
              title: "部门详情",
              hidden: true
            },
            component: "/system/dept/detail.vue"
          }
        ]
      }
    ]
  },

  // Setting - 系统设置
  {
    path: "/setting",
    name: "setting",
    redirect: "/setting/account",
    component: "/Layout.vue",
    meta: {
      title: "系统设置",
      icon: "solar:settings-outline",
      sort: 7
    },
    children: [
      {
        path: "/setting/account",
        name: "setting-account",
        meta: {
          title: "用户设置"
        },
        component: "/setting/account.vue"
      },
      {
        path: "/setting/theme",
        name: "setting-theme",
        meta: {
          title: "主题设置"
        },
        component: "/setting/theme.vue"
      },
      {
        path: "/setting/security",
        name: "setting-security",
        meta: {
          title: "安全设置"
        },
        component: "/setting/security.vue"
      }
    ]
  },

  // Frame - 外部页面
  {
    path: "/frame",
    name: "frame",
    redirect: "/frame/naive-admin",
    component: "/Layout.vue",
    meta: {
      title: "外部页面",
      icon: "solar:euro-broken",
      sort: 8
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

  // About - 关于
  {
    path: "/about",
    name: "about",
    component: "/Layout.vue",
    meta: {
      title: "关于",
      sort: 9,
      isRoot: true,
      icon: "solar:info-circle-broken"
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

export default routeConfig;
