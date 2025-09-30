<script setup lang="ts">
import {
  commonRules,
  confirmPasswordRule,
  customRule,
  idCardRule,
  lengthRule,
  numberRangeRule,
  requiredRule,
  urlRule
} from "@/lib/formValidation";
import { useMessage } from "naive-ui";
import type { FormInst, FormRules } from "naive-ui";
import { reactive, ref } from "vue";

const message = useMessage();

// 表单引用
const formRef = ref<FormInst>();
const submitLoading = ref(false);

// 表单数据
const formData = reactive({
  username: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  age: null as number | null,
  salary: null as number | null,
  position: "",
  skills: [] as string[],
  birthDate: null as number | null,
  workDateRange: null as [number, number] | null,
  website: "",
  idCard: "",
  introduction: "",
  agreement: false
});

// 表单验证规则
const formRules: FormRules = {
  username: commonRules.username,
  email: commonRules.email,
  phone: commonRules.phone,
  password: commonRules.password,
  confirmPassword: confirmPasswordRule("password"),
  age: [requiredRule("请输入年龄"), numberRangeRule(18, 65, "年龄必须在18-65岁之间")],
  salary: [
    requiredRule("请输入薪资期望"),
    numberRangeRule(3000, 50000, "薪资期望应在3000-50000元之间")
  ],
  position: requiredRule("请选择职位"),
  skills: {
    type: "array",
    min: 2,
    message: "请至少选择2项技能",
    trigger: ["change"]
  },
  birthDate: requiredRule("请选择出生日期"),
  workDateRange: requiredRule("请选择工作时间范围"),
  website: [requiredRule("请输入个人网站"), urlRule],
  idCard: [requiredRule("请输入身份证号"), idCardRule],
  introduction: [requiredRule("请输入个人简介"), lengthRule(10, 500, "个人简介应在10-500字之间")],
  agreement: customRule((value: boolean) => value === true, "请先阅读并同意用户协议和隐私政策")
};

// 职位选项
const positionOptions = [
  { label: "前端工程师", value: "frontend" },
  { label: "后端工程师", value: "backend" },
  { label: "全栈工程师", value: "fullstack" },
  { label: "UI/UX设计师", value: "designer" },
  { label: "产品经理", value: "pm" },
  { label: "测试工程师", value: "tester" }
];

// 技能选项
const skillOptions = [
  { label: "Vue.js", value: "vue" },
  { label: "React", value: "react" },
  { label: "Angular", value: "angular" },
  { label: "TypeScript", value: "typescript" },
  { label: "Node.js", value: "nodejs" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "Go", value: "go" },
  { label: "Docker", value: "docker" },
  { label: "Kubernetes", value: "k8s" }
];

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();

    submitLoading.value = true;

    // 模拟提交延迟
    await new Promise((resolve) => setTimeout(resolve, 2000));

    message.success("表单验证通过，提交成功！");
    console.log("提交的数据:", formData);
  } catch (errors) {
    console.log("验证失败:", errors);
    message.error("表单验证失败，请检查填写内容");
  } finally {
    submitLoading.value = false;
  }
};

// 重置表单
const handleReset = () => {
  formRef.value?.restoreValidation();
  Object.assign(formData, {
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    age: null,
    salary: null,
    position: "",
    skills: [],
    birthDate: null,
    workDateRange: null,
    website: "",
    idCard: "",
    introduction: "",
    agreement: false
  });
  message.info("表单已重置");
};

// 验证单个字段
const handleValidateField = () => {
  formRef.value?.validate(
    (errors) => {
      if (!errors) {
        message.success("用户名验证通过");
      } else {
        message.error("用户名验证失败");
      }
    },
    (rule) => {
      return rule?.key === "username";
    }
  );
};
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-12">
    <n-card title="表单验证示例" class="md:col-span-8">
      <template #header-extra>
        <n-tag type="warning">Form Validation</n-tag>
      </template>

      <n-alert type="info" class="mb-4">
        本页面展示了各种表单验证规则的使用，包括必填、格式验证、自定义验证等
      </n-alert>

      <n-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-placement="left"
        label-width="140px"
        size="medium"
      >
        <!-- 基础验证 -->
        <n-divider title-placement="left">基础验证</n-divider>

        <n-form-item label="用户名" path="username">
          <n-input
            v-model:value="formData.username"
            placeholder="请输入用户名（2-20个字符）"
            clearable
          />
        </n-form-item>

        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="formData.email" placeholder="请输入邮箱地址" clearable />
        </n-form-item>

        <n-form-item label="手机号" path="phone">
          <n-input v-model:value="formData.phone" placeholder="请输入手机号码" clearable />
        </n-form-item>

        <!-- 密码验证 -->
        <n-divider title-placement="left">密码验证</n-divider>

        <n-form-item label="密码" path="password">
          <n-input
            v-model:value="formData.password"
            type="password"
            placeholder="至少8位，包含大小写字母和数字"
            show-password-on="click"
            clearable
          />
        </n-form-item>

        <n-form-item label="确认密码" path="confirmPassword">
          <n-input
            v-model:value="formData.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password-on="click"
            clearable
          />
        </n-form-item>

        <!-- 数字验证 -->
        <n-divider title-placement="left">数字验证</n-divider>

        <n-form-item label="年龄" path="age">
          <n-inputNumber
            v-model:value="formData.age"
            placeholder="请输入年龄（18-65岁）"
            :min="18"
            :max="65"
            clearable
          />
        </n-form-item>

        <n-form-item label="薪资期望" path="salary">
          <n-inputNumber
            v-model:value="formData.salary"
            placeholder="请输入薪资期望（3000-50000）"
            :min="3000"
            :max="50000"
            :step="1000"
            clearable
          >
            <template #suffix>元/月</template>
          </n-inputNumber>
        </n-form-item>

        <!-- 选择验证 -->
        <n-divider title-placement="left">选择验证</n-divider>

        <n-form-item label="职位" path="position">
          <n-select
            v-model:value="formData.position"
            placeholder="请选择职位"
            clearable
            :options="positionOptions"
          />
        </n-form-item>

        <n-form-item label="技能" path="skills">
          <n-select
            v-model:value="formData.skills"
            multiple
            placeholder="请选择技能（至少选择2项）"
            clearable
            :options="skillOptions"
          />
        </n-form-item>

        <!-- 日期验证 -->
        <n-divider title-placement="left">日期验证</n-divider>

        <n-form-item label="出生日期" path="birthDate">
          <n-date-picker
            v-model:value="formData.birthDate"
            type="date"
            placeholder="请选择出生日期"
            clearable
          />
        </n-form-item>

        <n-form-item label="工作时间范围" path="workDateRange">
          <n-date-picker
            v-model:value="formData.workDateRange"
            type="daterange"
            placeholder="请选择工作时间范围"
            clearable
          />
        </n-form-item>

        <!-- 自定义验证 -->
        <n-divider title-placement="left">自定义验证</n-divider>

        <n-form-item label="个人网站" path="website">
          <n-input v-model:value="formData.website" placeholder="请输入个人网站 URL" clearable />
        </n-form-item>

        <n-form-item label="身份证号" path="idCard">
          <n-input v-model:value="formData.idCard" placeholder="请输入身份证号码" clearable />
        </n-form-item>

        <n-form-item label="个人简介" path="introduction">
          <n-input
            v-model:value="formData.introduction"
            type="textarea"
            placeholder="请输入个人简介（10-500字）"
            :rows="4"
            clearable
            show-count
            maxlength="500"
          />
        </n-form-item>

        <!-- 协议验证 -->
        <n-form-item path="agreement">
          <n-checkbox v-model:checked="formData.agreement">
            我已阅读并同意<n-button text type="primary">《用户协议》</n-button>和<n-button
              text
              type="primary"
              >《隐私政策》</n-button
            >
          </n-checkbox>
        </n-form-item>

        <n-form-item>
          <n-space>
            <n-button type="primary" :loading="submitLoading" @click="handleSubmit">
              提交表单
            </n-button>
            <n-button @click="handleReset"> 重置表单 </n-button>
            <n-button @click="handleValidateField"> 验证用户名字段 </n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-card>

    <!-- 表单数据预览 -->
    <n-card title="表单数据" class="md:col-span-4">
      <n-code :code="JSON.stringify(formData, null, 2)" language="json" />
    </n-card>
  </div>
</template>
