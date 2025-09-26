<script setup lang="ts">
import { requiredRule } from "@/lib/formValidation";
import { useMessage } from "naive-ui";
import type { FormInst, FormRules, UploadFileInfo } from "naive-ui";
import { reactive, ref } from "vue";

const message = useMessage();

// 表单引用
const formRef = ref<FormInst>();
const submitLoading = ref(false);

// 表单数据
const formData = reactive({
  title: "",
  category: "",
  description: "",
  startDate: null as number | null,
  endDate: null as number | null,
  priority: "",
  tags: [] as string[],
  assignee: [] as string[],
  settings: {
    isPublic: false,
    allowComments: true,
    notifyEmail: true,
    autoArchive: false
  }
});

// 动态数据
const customTags = ref<string[]>([]);
const teamMembers = ref<Array<{ name: string; role: string; email: string }>>([]);
const fileList = ref<UploadFileInfo[]>([]);
const accessPassword = ref("");
const accessLevel = ref("public");

// 表单验证规则
const formRules: FormRules = {
  title: requiredRule("请输入项目名称"),
  category: requiredRule("请选择项目类型"),
  description: requiredRule("请输入项目描述"),
  startDate: requiredRule("请选择开始日期"),
  priority: requiredRule("请选择优先级"),
  tags: {
    type: "array",
    min: 1,
    message: "请至少选择一个技术栈",
    trigger: ["change"]
  }
};

// 选项数据
const categoryOptions = [
  { label: "Web 应用", value: "web" },
  { label: "移动应用", value: "mobile" },
  { label: "桌面应用", value: "desktop" },
  { label: "API 服务", value: "api" },
  { label: "数据分析", value: "data" },
  { label: "机器学习", value: "ml" }
];

const priorityOptions = [
  { label: "低", value: "low" },
  { label: "中", value: "medium" },
  { label: "高", value: "high" },
  { label: "紧急", value: "urgent" }
];

const tagOptions = [
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

const memberOptions = [
  { label: "张三", value: "zhangsan" },
  { label: "李四", value: "lisi" },
  { label: "王五", value: "wangwu" },
  { label: "赵六", value: "zhaoliu" },
  { label: "钱七", value: "qianqi" }
];

const roleOptions = [
  { label: "前端开发", value: "frontend" },
  { label: "后端开发", value: "backend" },
  { label: "UI设计师", value: "designer" },
  { label: "产品经理", value: "pm" },
  { label: "测试工程师", value: "tester" }
];

// 文件上传处理
const handleFileChange = (options: { fileList: UploadFileInfo[] }) => {
  console.log("文件列表更新:", options.fileList);
};

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();

    submitLoading.value = true;

    // 模拟提交延迟
    await new Promise((resolve) => setTimeout(resolve, 2000));

    message.success("项目创建成功！");
    console.log("提交的数据:", {
      ...formData,
      customTags: customTags.value,
      teamMembers: teamMembers.value,
      files: fileList.value,
      accessPassword: accessPassword.value,
      accessLevel: accessLevel.value
    });
  } catch (error) {
    message.error("请检查表单填写是否正确");
  } finally {
    submitLoading.value = false;
  }
};

// 保存草稿
const handleSaveDraft = () => {
  message.info("草稿已保存到本地");
  localStorage.setItem("project-draft", JSON.stringify(formData));
};

// 重置表单
const handleReset = () => {
  formRef.value?.restoreValidation();
  Object.assign(formData, {
    title: "",
    category: "",
    description: "",
    startDate: null,
    endDate: null,
    priority: "",
    tags: [],
    assignee: [],
    settings: {
      isPublic: false,
      allowComments: true,
      notifyEmail: true,
      autoArchive: false
    }
  });
  customTags.value = [];
  teamMembers.value = [];
  fileList.value = [];
  accessPassword.value = "";
  accessLevel.value = "public";
  message.info("表单已重置");
};
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-12">
    <NCard title="高级表单示例" class="sm:col-span-8">
      <template #header-extra>
        <NTag type="success">Advanced Form</NTag>
      </template>

      <NAlert type="info" class="mb-4">
        高级表单包含复杂的表单控件组合、动态表单项、条件显示等功能
      </NAlert>

      <NForm
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-placement="left"
        label-width="140px"
        size="medium"
      >
        <!-- 项目基本信息 -->
        <NCard title="项目基本信息" size="small" class="mb-4">
          <NGrid :cols="2" :x-gap="16">
            <NGridItem>
              <NFormItem label="项目名称" path="title">
                <NInput v-model:value="formData.title" placeholder="请输入项目名称" clearable />
              </NFormItem>
            </NGridItem>

            <NGridItem>
              <NFormItem label="项目类型" path="category">
                <NSelect
                  v-model:value="formData.category"
                  placeholder="请选择项目类型"
                  clearable
                  :options="categoryOptions"
                />
              </NFormItem>
            </NGridItem>

            <NGridItem :span="2">
              <NFormItem label="项目描述" path="description">
                <NInput
                  v-model:value="formData.description"
                  type="textarea"
                  placeholder="请输入项目描述"
                  :rows="3"
                  clearable
                  show-count
                  maxlength="200"
                />
              </NFormItem>
            </NGridItem>
          </NGrid>
        </NCard>

        <!-- 时间和优先级设置 -->
        <NCard title="时间和优先级" size="small" class="mb-4">
          <NGrid :cols="3" :x-gap="16">
            <NGridItem>
              <NFormItem label="开始日期" path="startDate">
                <NDatePicker
                  v-model:value="formData.startDate"
                  type="date"
                  placeholder="选择开始日期"
                  clearable
                />
              </NFormItem>
            </NGridItem>

            <NGridItem>
              <NFormItem label="结束日期" path="endDate">
                <NDatePicker
                  v-model:value="formData.endDate"
                  type="date"
                  placeholder="选择结束日期"
                  clearable
                  :is-date-disabled="(ts: number) => ts < (formData.startDate || 0)"
                />
              </NFormItem>
            </NGridItem>

            <NGridItem>
              <NFormItem label="优先级" path="priority">
                <NSelect
                  v-model:value="formData.priority"
                  placeholder="请选择优先级"
                  :options="priorityOptions"
                  clearable
                />
              </NFormItem>
            </NGridItem>
          </NGrid>
        </NCard>

        <!-- 项目标签 -->
        <NCard title="项目标签" size="small" class="mb-4">
          <NFormItem label="技术栈" path="tags">
            <NSelect
              v-model:value="formData.tags"
              multiple
              placeholder="选择项目使用的技术栈"
              clearable
              :options="tagOptions"
              max-tag-count="responsive"
            />
          </NFormItem>

          <NFormItem label="自定义标签">
            <NDynamicTags v-model:value="customTags" />
          </NFormItem>
        </NCard>

        <!-- 团队成员 -->
        <NCard title="团队成员" size="small" class="mb-4">
          <NFormItem label="项目负责人" path="assignee">
            <NSelect
              v-model:value="formData.assignee"
              multiple
              placeholder="选择项目负责人"
              clearable
              :options="memberOptions"
              :max="3"
            />
          </NFormItem>

          <!-- 动态成员列表 -->
          <NFormItem label="团队成员">
            <NDynamicInput
              v-model:value="teamMembers"
              placeholder="输入成员名称"
              :on-create="() => ({ name: '', role: '', email: '' })"
            >
              <template #default="{ value }">
                <NGrid :cols="3" :x-gap="8">
                  <NGridItem>
                    <NInput v-model:value="value.name" placeholder="姓名" />
                  </NGridItem>
                  <NGridItem>
                    <NSelect v-model:value="value.role" placeholder="角色" :options="roleOptions" />
                  </NGridItem>
                  <NGridItem>
                    <NInput v-model:value="value.email" placeholder="邮箱" />
                  </NGridItem>
                </NGrid>
              </template>
            </NDynamicInput>
          </NFormItem>
        </NCard>

        <!-- 项目配置 -->
        <NCard title="项目配置" size="small" class="mb-4">
          <NGrid :cols="2" :x-gap="16">
            <NGridItem>
              <NFormItem label="是否公开" path="settings.isPublic">
                <NSwitch v-model:value="formData.settings.isPublic" />
                <span class="text-foreground-subtle ml-2">公开项目可被其他用户查看</span>
              </NFormItem>
            </NGridItem>

            <NGridItem>
              <NFormItem label="允许评论" path="settings.allowComments">
                <NSwitch v-model:value="formData.settings.allowComments" />
                <span class="text-foreground-subtle ml-2">允许团队成员添加评论</span>
              </NFormItem>
            </NGridItem>

            <NGridItem>
              <NFormItem label="邮件通知" path="settings.notifyEmail">
                <NSwitch v-model:value="formData.settings.notifyEmail" />
                <span class="text-foreground-subtle ml-2">项目更新时发送邮件</span>
              </NFormItem>
            </NGridItem>

            <NGridItem>
              <NFormItem label="自动归档" path="settings.autoArchive">
                <NSwitch v-model:value="formData.settings.autoArchive" />
                <span class="text-foreground-subtle ml-2">项目完成后自动归档</span>
              </NFormItem>
            </NGridItem>
          </NGrid>
        </NCard>

        <!-- 文件上传 -->
        <NCard title="项目文件" size="small" class="mb-4">
          <NFormItem label="项目文档" path="files">
            <NUpload
              v-model:file-list="fileList"
              multiple
              directory-dnd
              :max="5"
              :on-change="handleFileChange"
            >
              <NUploadDragger>
                <div class="text-center">
                  <NIcon size="48" :depth="3">
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
                      />
                    </svg>
                  </NIcon>
                  <NText style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </NText>
                  <NP depth="3" style="margin: 8px 0 0 0">
                    支持单个或批量上传，严禁上传公司敏感信息
                  </NP>
                </div>
              </NUploadDragger>
            </NUpload>
          </NFormItem>
        </NCard>

        <!-- 条件显示的高级配置 -->
        <NCard v-if="formData.settings.isPublic" title="公开设置" size="small" class="mb-4">
          <NFormItem label="访问密码">
            <NInput
              v-model:value="accessPassword"
              type="password"
              placeholder="设置访问密码（可选）"
              clearable
            />
          </NFormItem>

          <NFormItem label="访问权限">
            <NRadioGroup v-model:value="accessLevel">
              <NSpace>
                <NRadio value="public">完全公开</NRadio>
                <NRadio value="limited">限制访问</NRadio>
                <NRadio value="private">仅团队可见</NRadio>
              </NSpace>
            </NRadioGroup>
          </NFormItem>
        </NCard>

        <!-- 操作按钮 -->
        <NFormItem>
          <NSpace>
            <NButton type="primary" :loading="submitLoading" @click="handleSubmit">
              创建项目
            </NButton>
            <NButton @click="handleSaveDraft"> 保存草稿 </NButton>
            <NButton @click="handleReset"> 重置表单 </NButton>
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
