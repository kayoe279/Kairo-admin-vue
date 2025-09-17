<script setup lang="ts">
import { requiredRule } from "@/lib/formValidation";
import type { StepFormData } from "@/types/form";
import { useMessage } from "naive-ui";
import type { FormInst, FormRules } from "naive-ui";
import { computed, onMounted, reactive, ref } from "vue";

const message = useMessage();

// 表单引用
const basicFormRef = ref<FormInst>();
const configFormRef = ref<FormInst>();
const confirmFormRef = ref<FormInst>();
const submitLoading = ref(false);

// 当前步骤
const currentStep = ref(1);

// 表单数据
const formData = reactive<StepFormData>({
  basic: {
    projectName: "",
    projectType: "",
    description: "",
    timeline: null,
    budget: null
  },
  config: {
    template: "",
    features: [],
    database: "mysql",
    deployment: "",
    teamSize: 5,
    priority: 3
  },
  confirm: {
    terms: false,
    newsletter: false,
    remarks: ""
  }
});

// 进度百分比
const progressPercentage = computed(() => {
  return Math.round((currentStep.value / 3) * 100);
});

// 表单验证规则
const basicFormRules: FormRules = {
  projectName: requiredRule("请输入项目名称"),
  projectType: requiredRule("请选择项目类型"),
  description: requiredRule("请输入项目描述")
};

const configFormRules: FormRules = {
  template: requiredRule("请选择技术模板"),
  features: {
    type: "array",
    min: 1,
    message: "请至少选择一个功能特性",
    trigger: ["change"]
  },
  deployment: requiredRule("请选择部署方式")
};

const confirmFormRules: FormRules = {
  terms: {
    validator: (rule, value) => {
      if (!value) {
        return new Error("请先阅读并同意项目开发协议");
      }
      return true;
    },
    trigger: ["change"]
  }
};

// 选项数据
const projectTypeOptions = [
  { label: "Web 应用", value: "web" },
  { label: "移动应用", value: "mobile" },
  { label: "桌面应用", value: "desktop" },
  { label: "小程序", value: "miniapp" },
  { label: "API 服务", value: "api" }
];

const templateOptions = [
  { label: "Vue.js + TypeScript", value: "vue-ts" },
  { label: "React + TypeScript", value: "react-ts" },
  { label: "Next.js", value: "nextjs" },
  { label: "Nuxt.js", value: "nuxtjs" },
  { label: "Express.js", value: "express" },
  { label: "Nest.js", value: "nestjs" }
];

const deploymentOptions = [
  { label: "传统服务器", value: "server" },
  { label: "容器部署", value: "docker" },
  { label: "云服务", value: "cloud" },
  { label: "Serverless", value: "serverless" },
  { label: "CDN 静态托管", value: "cdn" }
];

// 获取标签文本的辅助函数
const getProjectTypeLabel = (value: string) => {
  return projectTypeOptions.find((item) => item.value === value)?.label || value;
};

const getTemplateLabel = (value: string) => {
  return templateOptions.find((item) => item.value === value)?.label || value;
};

const getDeploymentLabel = (value: string) => {
  return deploymentOptions.find((item) => item.value === value)?.label || value;
};

const getFeatureLabel = (value: string) => {
  const featureMap: Record<string, string> = {
    auth: "用户认证",
    admin: "管理后台",
    api: "API 接口",
    payment: "支付系统",
    notification: "消息通知",
    analytics: "数据分析"
  };
  return featureMap[value] || value;
};

// 下一步
const handleNextStep = async () => {
  try {
    if (currentStep.value === 1) {
      await basicFormRef.value?.validate();
    } else if (currentStep.value === 2) {
      await configFormRef.value?.validate();
    }

    currentStep.value++;
    message.success("验证通过，进入下一步");
  } catch (error) {
    message.error("请检查当前步骤的表单填写");
  }
};

// 上一步
const handlePrevStep = () => {
  currentStep.value--;
};

// 提交表单
const handleSubmit = async () => {
  try {
    await confirmFormRef.value?.validate();

    submitLoading.value = true;

    // 模拟提交延迟
    await new Promise((resolve) => setTimeout(resolve, 2000));

    message.success("项目创建成功！");
    console.log("提交的完整数据:", formData);

    // 重置表单
    currentStep.value = 1;
    Object.assign(formData, {
      basic: {
        projectName: "",
        projectType: "",
        description: "",
        timeline: null,
        budget: null
      },
      config: {
        template: "",
        features: [],
        database: "mysql",
        deployment: "",
        teamSize: 5,
        priority: 3
      },
      confirm: {
        terms: false,
        newsletter: false,
        remarks: ""
      }
    });
  } catch (error) {
    message.error("请检查表单填写是否正确");
  } finally {
    submitLoading.value = false;
  }
};

// 保存草稿
const handleSaveDraft = () => {
  const draftData = {
    currentStep: currentStep.value,
    formData: formData
  };
  localStorage.setItem("step-form-draft", JSON.stringify(draftData));
  message.success("草稿已保存");
};

// 页面加载时尝试恢复草稿
const loadDraft = () => {
  const draft = localStorage.getItem("step-form-draft");
  if (draft) {
    try {
      const { currentStep: savedStep, formData: savedData } = JSON.parse(draft);
      currentStep.value = savedStep;
      Object.assign(formData, savedData);
      message.info("已恢复上次保存的草稿");
    } catch (error) {
      console.warn("草稿恢复失败:", error);
    }
  }
};

onMounted(() => {
  loadDraft();
});
</script>

<template>
  <div>
    <NCard title="分步表单示例" class="mb-6">
      <template #header-extra>
        <NTag type="primary">Step Form</NTag>
      </template>

      <NAlert type="info" class="mb-4"> 分步表单将复杂的表单分解为多个步骤，提升用户体验 </NAlert>

      <!-- 步骤指示器 -->
      <NSteps :current="currentStep" class="mb-6">
        <NStep title="基本信息" description="填写项目基本信息" />
        <NStep title="配置选项" description="设置项目配置" />
        <NStep title="确认提交" description="确认信息并提交" />
      </NSteps>

      <!-- 第一步：基本信息 -->
      <div v-show="currentStep === 1">
        <NCard title="项目基本信息" size="small">
          <NForm
            ref="basicFormRef"
            :model="formData.basic"
            :rules="basicFormRules"
            label-placement="left"
            label-width="120px"
            size="medium"
          >
            <NFormItem label="项目名称" path="projectName">
              <NInput
                v-model:value="formData.basic.projectName"
                placeholder="请输入项目名称"
                clearable
              />
            </NFormItem>

            <NFormItem label="项目类型" path="projectType">
              <NSelect
                v-model:value="formData.basic.projectType"
                placeholder="请选择项目类型"
                clearable
                :options="projectTypeOptions"
              />
            </NFormItem>

            <NFormItem label="项目描述" path="description">
              <NInput
                v-model:value="formData.basic.description"
                type="textarea"
                placeholder="请描述项目的主要功能和目标"
                :rows="4"
                clearable
                show-count
                maxlength="300"
              />
            </NFormItem>

            <NFormItem label="预期工期">
              <NDatePicker
                v-model:value="formData.basic.timeline"
                type="daterange"
                placeholder="选择项目开始和结束时间"
                clearable
              />
            </NFormItem>

            <NFormItem label="预算范围">
              <NInputNumber
                v-model:value="formData.basic.budget"
                placeholder="请输入预算金额"
                :min="0"
                :step="1000"
                clearable
              >
                <template #suffix>元</template>
              </NInputNumber>
            </NFormItem>
          </NForm>
        </NCard>
      </div>

      <!-- 第二步：配置选项 -->
      <div v-show="currentStep === 2">
        <NCard title="项目配置" size="small">
          <NForm
            ref="configFormRef"
            :model="formData.config"
            :rules="configFormRules"
            label-placement="left"
            label-width="120px"
            size="medium"
          >
            <NFormItem label="技术模板" path="template">
              <NSelect
                v-model:value="formData.config.template"
                placeholder="选择项目技术模板"
                clearable
                :options="templateOptions"
              />
            </NFormItem>

            <NFormItem label="功能特性" path="features">
              <NCheckboxGroup v-model:value="formData.config.features">
                <NSpace vertical>
                  <NCheckbox value="auth">用户认证</NCheckbox>
                  <NCheckbox value="admin">管理后台</NCheckbox>
                  <NCheckbox value="api">API 接口</NCheckbox>
                  <NCheckbox value="payment">支付系统</NCheckbox>
                  <NCheckbox value="notification">消息通知</NCheckbox>
                  <NCheckbox value="analytics">数据分析</NCheckbox>
                </NSpace>
              </NCheckboxGroup>
            </NFormItem>

            <NFormItem label="数据库类型" path="database">
              <NRadioGroup v-model:value="formData.config.database">
                <NSpace>
                  <NRadio value="mysql">MySQL</NRadio>
                  <NRadio value="postgresql">PostgreSQL</NRadio>
                  <NRadio value="mongodb">MongoDB</NRadio>
                  <NRadio value="redis">Redis</NRadio>
                </NSpace>
              </NRadioGroup>
            </NFormItem>

            <NFormItem label="部署方式" path="deployment">
              <NSelect
                v-model:value="formData.config.deployment"
                placeholder="选择部署方式"
                clearable
                :options="deploymentOptions"
              />
            </NFormItem>

            <NFormItem label="团队规模">
              <NSlider
                v-model:value="formData.config.teamSize"
                :min="1"
                :max="20"
                :step="1"
                :marks="{ 1: '1人', 5: '5人', 10: '10人', 20: '20人' }"
              />
            </NFormItem>

            <NFormItem label="项目优先级">
              <NRate v-model:value="formData.config.priority" />
            </NFormItem>
          </NForm>
        </NCard>
      </div>

      <!-- 第三步：确认信息 -->
      <div v-show="currentStep === 3">
        <NCard title="确认项目信息" size="small">
          <NForm
            ref="confirmFormRef"
            :model="formData.confirm"
            :rules="confirmFormRules"
            label-placement="left"
            label-width="120px"
            size="medium"
          >
            <!-- 项目信息预览 -->
            <NDescriptions label-placement="left" :column="2" class="mb-6">
              <NDescriptionsItem label="项目名称">{{
                formData.basic.projectName
              }}</NDescriptionsItem>
              <NDescriptionsItem label="项目类型">{{
                getProjectTypeLabel(formData.basic.projectType)
              }}</NDescriptionsItem>
              <NDescriptionsItem label="技术模板">{{
                getTemplateLabel(formData.config.template)
              }}</NDescriptionsItem>
              <NDescriptionsItem label="数据库">{{ formData.config.database }}</NDescriptionsItem>
              <NDescriptionsItem label="部署方式">{{
                getDeploymentLabel(formData.config.deployment)
              }}</NDescriptionsItem>
              <NDescriptionsItem label="团队规模"
                >{{ formData.config.teamSize }} 人</NDescriptionsItem
              >
              <NDescriptionsItem label="项目描述" :span="2">{{
                formData.basic.description
              }}</NDescriptionsItem>
              <NDescriptionsItem label="功能特性" :span="2">
                <NSpace>
                  <NTag
                    v-for="feature in formData.config.features"
                    :key="feature"
                    type="info"
                    size="small"
                  >
                    {{ getFeatureLabel(feature) }}
                  </NTag>
                </NSpace>
              </NDescriptionsItem>
            </NDescriptions>

            <NDivider />

            <NFormItem path="terms">
              <NCheckbox v-model:checked="formData.confirm.terms">
                我已阅读并同意<NButton text type="primary">《项目开发协议》</NButton>
              </NCheckbox>
            </NFormItem>

            <NFormItem path="newsletter">
              <NCheckbox v-model:checked="formData.confirm.newsletter">
                订阅项目进度通知和技术资讯
              </NCheckbox>
            </NFormItem>

            <NFormItem label="备注说明">
              <NInput
                v-model:value="formData.confirm.remarks"
                type="textarea"
                placeholder="有什么特殊要求或说明请在此填写"
                :rows="3"
                clearable
              />
            </NFormItem>
          </NForm>
        </NCard>
      </div>

      <!-- 操作按钮 -->
      <div class="mt-6 flex justify-between">
        <NButton v-if="currentStep > 1" @click="handlePrevStep" size="large"> 上一步 </NButton>
        <div v-else></div>

        <NSpace>
          <NButton @click="handleSaveDraft" size="large"> 保存草稿 </NButton>

          <NButton v-if="currentStep < 3" type="primary" @click="handleNextStep" size="large">
            下一步
          </NButton>

          <NButton
            v-else
            type="primary"
            :loading="submitLoading"
            @click="handleSubmit"
            size="large"
          >
            提交项目
          </NButton>
        </NSpace>
      </div>
    </NCard>

    <!-- 进度提示 -->
    <NCard title="填写进度" class="mt-6">
      <NProgress
        type="line"
        :percentage="progressPercentage"
        :status="currentStep === 3 ? 'success' : 'info'"
        show-indicator
      >
        步骤 {{ currentStep }} / 3
      </NProgress>
    </NCard>
  </div>
</template>
