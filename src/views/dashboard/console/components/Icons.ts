import { h } from "vue";
import SvgIcon from "@/components/atoms/SvgIcon.vue";

export default {
  CaretUpOutlined: () => h(SvgIcon, { icon: "ant-design:caret-up-outlined" }),
  CaretDownOutlined: () => h(SvgIcon, { icon: "ant-design:caret-down-outlined" }),
  UsergroupAddOutlined: () => h(SvgIcon, { icon: "ant-design:usergroup-add-outlined" }),
  BarChartOutlined: () => h(SvgIcon, { icon: "ant-design:bar-chart-outlined" }),
  ShoppingCartOutlined: () => h(SvgIcon, { icon: "ant-design:shopping-cart-outlined" }),
  AccountBookOutlined: () => h(SvgIcon, { icon: "ant-design:account-book-outlined" }),
  CreditCardOutlined: () => h(SvgIcon, { icon: "ant-design:credit-card-outlined" }),
  MailOutlined: () => h(SvgIcon, { icon: "ant-design:mail-outlined" }),
  TagsOutlined: () => h(SvgIcon, { icon: "ant-design:tags-outlined" }),
  SettingOutlined: () => h(SvgIcon, { icon: "ant-design:setting-outlined" })
};
