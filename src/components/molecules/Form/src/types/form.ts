import type { ComponentType } from "./index";
import { FormValidateMessages } from "naive-ui/es/form/src/interface";
import type { ButtonProps } from "naive-ui/lib/button";
import { FormRules } from "naive-ui/lib/form";
import type { GridItemProps, GridProps } from "naive-ui/lib/grid";
import type { CSSProperties } from "vue";

export interface FormSchema {
  field: string;
  label: string;
  labelMessage?: string;
  labelMessageStyle?: object | string;
  defaultValue?: any;
  component?: ComponentType;
  componentProps?: object;
  slot?: string;
  rules?: object | object[];
  giProps?: GridItemProps;
  isFull?: boolean;
  suffix?: string;
}

export interface CustomFormProps {
  schemas?: FormSchema[];
  layout?: string;
  isFull?: boolean;
  showActionButtonGroup?: boolean;
  showResetButton?: boolean;
  resetButtonOptions?: Partial<ButtonProps>;
  showSubmitButton?: boolean;
  showAdvancedButton?: boolean;
  submitButtonOptions?: Partial<ButtonProps>;
  submitButtonText?: string;
  resetButtonText?: string;
  gridProps?: GridProps;
  giProps?: GridItemProps;
  resetFunc?: () => Promise<void>;
  submitFunc?: () => Promise<void>;
  submitOnReset?: boolean;
  baseGridStyle?: CSSProperties;
  collapsedRows?: number;
}

export interface BasicFormProps {
  disabled?: boolean;
  inline?: boolean;
  labelWidth?: number | string | "auto";
  labelAlign?: "left" | "right";
  labelPlacement?: "left" | "top";
  model?: Recordable;
  rules?: FormRules;
  showFeedback?: boolean;
  showLabel?: boolean;
  showRequireMark?: boolean;
  requireMarkPlacement?: "left" | "right" | "right-hanging";
  size?: "small" | "medium" | "large";
  validateMessages?: FormValidateMessages;
}

export interface FormProps extends CustomFormProps, BasicFormProps {}

export interface FormActionType {
  submit: () => Promise<any>;
  setProps: (formProps: Partial<FormProps>) => Promise<void>;
  setSchema: (schemaProps: Partial<FormSchema[]>) => Promise<void>;
  setFieldsValue: (values: Recordable) => void;
  clearValidate: (name?: string | string[]) => Promise<void>;
  getFieldsValue: () => Recordable;
  resetFields: () => Promise<void>;
  validate: (nameList?: any[]) => Promise<any>;
  setLoading: (status: boolean) => void;
}

export type RegisterFn = (formInstance: FormActionType) => void;

export type UseFormReturnType = [RegisterFn, FormActionType];
