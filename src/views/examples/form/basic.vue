<script setup lang="ts">
import { emailRule, phoneRule, requiredRule } from "@/lib/formValidation";
import { useMessage } from "naive-ui";
import type { FormInst, FormRules } from "naive-ui";
import { reactive, ref } from "vue";

const message = useMessage();

// 表单引用
const formRef = ref<FormInst>();
const submitLoading = ref(false);

// 表单数据
const formData = reactive({
  name: "",
  email: "",
  phone: "",
  gender: "male",
  age: null as number | null,
  city: "",
  hobbies: [] as string[],
  address: "",
  notifications: true
});

// 表单验证规则
const formRules: FormRules = {
  name: requiredRule("请输入姓名"),
  email: [requiredRule("请输入邮箱"), emailRule],
  phone: [requiredRule("请输入手机号"), phoneRule],
  gender: requiredRule("请选择性别"),
  city: requiredRule("请选择城市")
};

// 城市选项
const cityOptions = [
  { label: "北京", value: "beijing" },
  { label: "上海", value: "shanghai" },
  { label: "广州", value: "guangzhou" },
  { label: "深圳", value: "shenzhen" },
  { label: "杭州", value: "hangzhou" },
  { label: "成都", value: "chengdu" },
  { label: "西安", value: "xian" },
  { label: "武汉", value: "wuhan" }
];

// 提交表单
const handleSubmit = async () => {
  submitLoading.value = true;
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      // 模拟提交延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));

      message.success("表单提交成功！");
      console.log("提交的数据:", formData);
    } else {
      message.error("请检查表单填写是否正确");
    }
    submitLoading.value = false;
  });
};

// 重置表单
const handleReset = () => {
  formRef.value?.restoreValidation();
  Object.assign(formData, {
    name: "",
    email: "",
    phone: "",
    gender: "male",
    age: null,
    city: "",
    hobbies: [],
    address: "",
    notifications: true
  });
  message.info("表单已重置");
};

// 填充示例数据
const handleFillDemo = () => {
  Object.assign(formData, {
    name: "张三",
    email: "zhangsan@example.com",
    phone: "13800138000",
    gender: "male",
    age: 28,
    city: "beijing",
    hobbies: ["reading", "music", "coding"],
    address: "北京市朝阳区XXX街道XXX号",
    notifications: true
  });
  message.info("已填充示例数据");
};
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-12">
    <NCard title="基础表单" class="sm:col-span-8">
      <template #header-extra>
        <NTag type="info">Basic Form</NTag>
      </template>

      <NForm
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-placement="left"
        label-width="120px"
        size="medium"
        class="max-w-600px"
      >
        <NFormItem label="姓名" path="name">
          <NInput v-model:value="formData.name" placeholder="请输入姓名" clearable />
        </NFormItem>

        <NFormItem label="邮箱" path="email">
          <NInput v-model:value="formData.email" placeholder="请输入邮箱地址" clearable />
        </NFormItem>

        <NFormItem label="手机号" path="phone">
          <NInput v-model:value="formData.phone" placeholder="请输入手机号码" clearable />
        </NFormItem>

        <NFormItem label="性别" path="gender">
          <NRadioGroup v-model:value="formData.gender">
            <NRadio value="male">男</NRadio>
            <NRadio value="female">女</NRadio>
          </NRadioGroup>
        </NFormItem>

        <NFormItem label="年龄" path="age">
          <NInputNumber
            v-model:value="formData.age"
            placeholder="请输入年龄"
            :min="1"
            :max="120"
            clearable
          />
        </NFormItem>

        <NFormItem label="城市" path="city">
          <NSelect
            v-model:value="formData.city"
            placeholder="请选择城市"
            clearable
            :options="cityOptions"
          />
        </NFormItem>

        <NFormItem label="爱好" path="hobbies">
          <NCheckboxGroup v-model:value="formData.hobbies">
            <NSpace>
              <NCheckbox value="reading">阅读</NCheckbox>
              <NCheckbox value="music">音乐</NCheckbox>
              <NCheckbox value="sports">运动</NCheckbox>
              <NCheckbox value="travel">旅行</NCheckbox>
              <NCheckbox value="coding">编程</NCheckbox>
            </NSpace>
          </NCheckboxGroup>
        </NFormItem>

        <NFormItem label="地址" path="address">
          <NInput
            v-model:value="formData.address"
            type="textarea"
            placeholder="请输入详细地址"
            :rows="3"
          />
        </NFormItem>

        <NFormItem label="接收通知" path="notifications">
          <NSwitch v-model:value="formData.notifications" />
          <span class="text-foreground-subtle ml-2">是否接收邮件通知</span>
        </NFormItem>

        <NFormItem label="&nbsp;">
          <NSpace>
            <NButton type="primary" :loading="submitLoading" @click="handleSubmit"> 提交 </NButton>
            <NButton @click="handleReset"> 重置 </NButton>
            <NButton @click="handleFillDemo"> 填充示例数据 </NButton>
          </NSpace>
        </NFormItem>
      </NForm>
    </NCard>

    <!-- 表单数据预览 -->
    <NCard title="表单数据预览" class="sm:col-span-4">
      <NCode :code="JSON.stringify(formData, null, 2)" language="json" />
    </NCard>
  </div>
</template>
