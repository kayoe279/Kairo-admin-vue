import { FormItemRule, SelectOption } from "naive-ui";

export // 表单项配置接口
interface FormItemConfig {
  path: string;
  label: string;
  type: "input" | "number" | "select" | "date" | "switch" | "radio" | "checkbox" | "textarea";
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  options?: SelectOption[];
  rule?: FormItemRule | FormItemRule[];
  showFeedback?: boolean;
  labelWidth?: string | number;
  labelPlacement?: "left" | "top";

  // 数字输入框特定属性
  min?: number;
  max?: number;
  step?: number;

  // 日期选择器特定属性
  dateType?: "date" | "datetime" | "daterange" | "datetimerange";

  // 文本域特定属性
  rows?: number;
  autosize?: boolean;

  isExpandField?: boolean;
}
