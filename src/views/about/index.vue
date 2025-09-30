<script lang="ts" setup>
import { useMedia } from "@/hooks";
import { appConfig } from "@/lib/settings/app";

export interface schemaItem {
  field: string;
  label: string;
}

const { isMobile } = useMedia();

const { pkg, lastBuildTime } = appInfo;
const { dependencies, devDependencies, version, name, author } = pkg;

const schema: schemaItem[] = [];
const devSchema: schemaItem[] = [];

Object.keys(dependencies).forEach((key) => {
  schema.push({ field: key, label: dependencies[key] });
});

Object.keys(devDependencies).forEach((key) => {
  devSchema.push({ field: key, label: devDependencies[key] });
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <n-card title="关于">
      {{ appConfig.description }}
    </n-card>

    <n-card title="项目信息" size="small" :segmented="{ content: true }">
      <n-descriptions bordered label-placement="left" :columns="isMobile ? 1 : 3">
        <n-descriptions-item label="项目名称">
          {{ name }}
        </n-descriptions-item>
        <n-descriptions-item label="作者">
          {{ author.name }}
        </n-descriptions-item>
        <n-descriptions-item label="邮箱">
          {{ author.email }}
        </n-descriptions-item>
        <n-descriptions-item label="版本">
          <n-tag type="info" size="small"> {{ version }} </n-tag>
        </n-descriptions-item>
        <n-descriptions-item label="最后编译时间">
          <n-tag type="success" size="small"> {{ lastBuildTime }} </n-tag>
        </n-descriptions-item>
        <n-descriptions-item label="预览地址">
          <div class="flex items-center">
            <a :href="appConfig.preview" class="text-primary" target="_blank"> 查看预览地址 </a>
          </div>
        </n-descriptions-item>
        <n-descriptions-item label="Github">
          <div class="flex h-full items-center">
            <a :href="appConfig.github" class="text-primary" target="_blank"> 查看Github地址 </a>
          </div>
        </n-descriptions-item>
      </n-descriptions>
    </n-card>

    <n-card title="开发环境依赖" size="small" :segmented="{ content: true }">
      <n-descriptions bordered label-placement="left" :columns="isMobile ? 1 : 3">
        <n-descriptions-item v-for="item in devSchema" :key="item.field" :label="item.field">
          {{ item.label }}
        </n-descriptions-item>
      </n-descriptions>
    </n-card>

    <n-card title="生产环境依赖" size="small" :segmented="{ content: true }">
      <n-descriptions bordered label-placement="left" :columns="isMobile ? 1 : 3">
        <n-descriptions-item v-for="item in schema" :key="item.field" :label="item.field">
          {{ item.label }}
        </n-descriptions-item>
      </n-descriptions>
    </n-card>
  </div>
</template>
