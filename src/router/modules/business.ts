import { svgIconRender } from "@/lib";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/business",
    name: "business",
    redirect: "/business/product",
    component: () => import("@/layouts/Layout.vue"),
    meta: {
      title: "业务管理",
      icon: svgIconRender({ icon: "solar:shop-broken" }),
      sort: 2
    },
    children: [
      // 商品管理 - 三级路由示例
      {
        path: "/business/product",
        name: "businessProduct",
        redirect: "/business/product/list",
        meta: {
          title: "商品管理"
        },
        children: [
          {
            path: "/business/product/list",
            name: "businessProductList",
            meta: {
              title: "商品列表"
            },
            component: () => import("@/views/business/product/list.vue")
          },
          {
            path: "/business/product/detail/:id?",
            name: "businessProductDetail",
            meta: {
              title: "商品详情",
              hidden: true
            },
            component: () => import("@/views/business/product/detail.vue")
          },
          // 商品分类 - 三级路由
          {
            path: "/business/product/category",
            name: "businessProductCategory",
            redirect: "/business/product/category/list",
            meta: {
              title: "商品分类"
            },
            children: [
              {
                path: "/business/product/category/list",
                name: "businessProductCategoryList",
                meta: {
                  title: "分类列表"
                },
                component: () => import("@/views/business/product/category/list.vue")
              },
              {
                path: "/business/product/category/detail/:id?",
                name: "businessProductCategoryDetail",
                meta: {
                  title: "分类详情",
                  hidden: true
                },
                component: () => import("@/views/business/product/category/detail.vue")
              }
            ]
          },
          {
            path: "/business/product/brand",
            name: "businessProductBrand",
            meta: {
              title: "品牌管理"
            },
            component: () => import("@/views/business/product/brand.vue")
          },
          {
            path: "/business/product/inventory",
            name: "businessProductInventory",
            meta: {
              title: "库存管理"
            },
            component: () => import("@/views/business/product/inventory.vue")
          }
        ]
      },
      // 订单管理
      {
        path: "/business/order",
        name: "businessOrder",
        redirect: "/business/order/list",
        meta: {
          title: "订单管理"
        },
        children: [
          {
            path: "/business/order/list",
            name: "businessOrderList",
            meta: {
              title: "订单列表"
            },
            component: () => import("@/views/business/order/list.vue")
          },
          {
            path: "/business/order/detail/:id",
            name: "businessOrderDetail",
            meta: {
              title: "订单详情",
              hidden: true
            },
            component: () => import("@/views/business/order/detail.vue")
          },
          {
            path: "/business/order/refund",
            name: "businessOrderRefund",
            meta: {
              title: "退款管理"
            },
            component: () => import("@/views/business/order/refund.vue")
          },
          {
            path: "/business/order/shipping",
            name: "businessOrderShipping",
            meta: {
              title: "物流管理"
            },
            component: () => import("@/views/business/order/shipping.vue")
          }
        ]
      },
      // 客户管理
      {
        path: "/business/customer",
        name: "businessCustomer",
        redirect: "/business/customer/list",
        meta: {
          title: "客户管理"
        },
        children: [
          {
            path: "/business/customer/list",
            name: "businessCustomerList",
            meta: {
              title: "客户列表"
            },
            component: () => import("@/views/business/customer/list.vue")
          },
          {
            path: "/business/customer/detail/:id",
            name: "businessCustomerDetail",
            meta: {
              title: "客户详情",
              hidden: true
            },
            component: () => import("@/views/business/customer/detail.vue")
          },
          {
            path: "/business/customer/group",
            name: "businessCustomerGroup",
            meta: {
              title: "客户分组"
            },
            component: () => import("@/views/business/customer/group.vue")
          },
          {
            path: "/business/customer/service",
            name: "businessCustomerService",
            meta: {
              title: "客服记录"
            },
            component: () => import("@/views/business/customer/service.vue")
          }
        ]
      }
    ]
  }
];

export default routes;
