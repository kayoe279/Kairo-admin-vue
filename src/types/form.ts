import type { FormInst, FormItemRule, FormRules, SelectOption } from "naive-ui";

// 基础表单数据接口
export interface BaseFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

// 用户注册表单数据
export interface UserRegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  gender: "male" | "female";
  age?: number;
  hobby: string[];
  city: string;
  introduction?: string;
  agreement: boolean;
}

// 搜索表单数据
export interface SearchFormData {
  keyword?: string;
  category?: string;
  status?: string | number;
  dateRange?: [number, number] | null;
  priceRange?: [number, number];
  tags?: string[];
}

// 高级表单数据
export interface AdvancedFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  startDate: number | null;
  endDate: number | null;
  priority: "low" | "medium" | "high";
  assignee: string[];
  files: File[];
  settings: {
    isPublic: boolean;
    allowComments: boolean;
    notifyEmail: boolean;
  };
}

// 分步表单数据
export interface StepFormData {
  // 第一步：基本信息
  basic: {
    projectName: string;
    projectType: string;
    description: string;
    timeline: [number, number] | null;
    budget: number | null;
  };
  // 第二步：配置信息
  config: {
    template: string;
    features: string[];
    database: string;
    deployment: string;
    teamSize: number;
    priority: number;
  };
  // 第三步：确认信息
  confirm: {
    terms: boolean;
    newsletter: boolean;
    remarks: string;
  };
}

// 表单配置选项
export interface FormOptions {
  labelPlacement?: "left" | "top";
  labelWidth?: string | number;
  size?: "small" | "medium" | "large";
  showFeedback?: boolean;
  showLabel?: boolean;
  showRequireMark?: boolean;
  requireMarkPlacement?: "left" | "right";
}

// 表单项配置
export interface FormItemConfig {
  path: string;
  label: string;
  rule?: FormItemRule | FormItemRule[];
  required?: boolean;
  showFeedback?: boolean;
  labelWidth?: string | number;
  labelAlign?: "left" | "center" | "right";
  labelPlacement?: "left" | "top";
}

// 通用表单组件 Props
export interface FormComponentProps {
  modelValue?: any;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  size?: "small" | "medium" | "large";
  clearable?: boolean;
}

// 搜索表单 Props
export interface SearchFormProps {
  modelValue: SearchFormData;
  loading?: boolean;
  showReset?: boolean;
  showSearch?: boolean;
  inline?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  labelWidth?: string | number;
}

// 表单验证规则类型
export type FormValidationRules<T = any> = FormRules & {
  [K in keyof T]?: FormItemRule | FormItemRule[];
};

// 表单实例类型
export type FormInstance = FormInst;

// 级联选项类型
export interface CascaderOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  children?: CascaderOption[];
}

// 表单状态
export interface FormState {
  loading: boolean;
  submitting: boolean;
  validating: boolean;
  errors: Record<string, string>;
}
