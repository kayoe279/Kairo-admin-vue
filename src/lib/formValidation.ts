import type { FormItemRule } from "naive-ui";

/**
 * 表单验证规则工具函数
 */

// 必填验证
export const requiredRule = (message = "此项为必填项"): FormItemRule => ({
  required: true,
  message,
  trigger: ["input", "blur"],
  key: "username"
});

// 邮箱验证
export const emailRule: FormItemRule = {
  type: "email",
  message: "请输入正确的邮箱格式",
  trigger: ["input", "blur"]
};

// 手机号验证
export const phoneRule: FormItemRule = {
  pattern: /^1[3-9]\d{9}$/,
  message: "请输入正确的手机号码",
  trigger: ["input", "blur"]
};

// 密码强度验证
export const passwordRule: FormItemRule = {
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  message: "密码至少8位，包含大小写字母和数字",
  trigger: ["input", "blur"]
};

// 确认密码验证
export const confirmPasswordRule = (passwordField: string): FormItemRule => ({
  validator: (rule, value) => {
    // 这里需要通过其他方式获取表单数据，由于 NaiveUI 的 validator 签名限制
    // 在实际使用时，可以通过外部传入的方式获取密码字段值
    return true; // 简化处理，实际项目中需要根据具体情况调整
  },
  trigger: ["input", "blur"]
});

// 长度范围验证
export const lengthRule = (min: number, max: number, message?: string): FormItemRule => ({
  min,
  max,
  message: message || `长度应在 ${min} 到 ${max} 个字符之间`,
  trigger: ["input", "blur"]
});

// 数字范围验证
export const numberRangeRule = (min: number, max: number, message?: string): FormItemRule => ({
  type: "number",
  min,
  max,
  message: message || `数值应在 ${min} 到 ${max} 之间`,
  trigger: ["input", "blur"]
});

// URL 验证
export const urlRule: FormItemRule = {
  type: "url",
  message: "请输入正确的URL格式",
  trigger: ["input", "blur"]
};

// 身份证号验证
export const idCardRule: FormItemRule = {
  pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  message: "请输入正确的身份证号码",
  trigger: ["input", "blur"]
};

// 自定义验证函数
export const customRule = (
  validator: (value: any) => boolean | Promise<boolean>,
  message = "验证失败"
): FormItemRule => ({
  validator: async (rule, value) => {
    const isValid = await validator(value);
    if (!isValid) {
      throw new Error(message);
    }
  },
  trigger: ["input", "blur"]
});

// 组合验证规则
export const combineRules = (...rules: FormItemRule[]): FormItemRule[] => rules;

// 常用验证规则组合
export const commonRules = {
  // 用户名：必填 + 长度限制
  username: combineRules(
    requiredRule("请输入用户名"),
    lengthRule(2, 20, "用户名长度应在2-20个字符之间")
  ),

  // 邮箱：必填 + 邮箱格式
  email: combineRules(requiredRule("请输入邮箱"), emailRule),

  // 手机号：必填 + 手机号格式
  phone: combineRules(requiredRule("请输入手机号"), phoneRule),

  // 密码：必填 + 强度验证
  password: combineRules(requiredRule("请输入密码"), passwordRule)
};

/**
 * 表单验证状态管理 Hook
 */
export function useFormValidation() {
  const validateField = async (formRef: any, field: string): Promise<boolean> => {
    try {
      await formRef.value?.validate([field]);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = async (formRef: any): Promise<boolean> => {
    try {
      await formRef.value?.validate();
      return true;
    } catch {
      return false;
    }
  };

  const restoreValidation = (formRef: any, field?: string) => {
    if (field) {
      formRef.value?.restoreValidation([field]);
    } else {
      formRef.value?.restoreValidation();
    }
  };

  return {
    validateField,
    validateForm,
    restoreValidation
  };
}
