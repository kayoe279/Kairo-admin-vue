<script lang="ts" setup>
import { appConfig } from "@/lib/settings/app";
import { NDescriptionsItem } from "naive-ui";

export interface schemaItem {
  field: string;
  label: string;
}

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
  <div>
    <n-card title="关于">
      {{ appConfig.description }}
    </n-card>

    <n-card title="项目信息" class="proCard mt-4" size="small" :segmented="{ content: true }">
      <n-descriptions bordered label-placement="left" class="py-2">
        <n-descriptionsItem label="项目名称">
          {{ name }}
        </n-descriptionsItem>
        <n-descriptionsItem label="作者">
          {{ author.name }}
        </n-descriptionsItem>
        <n-descriptionsItem label="邮箱">
          {{ author.email }}
        </n-descriptionsItem>
        <n-descriptionsItem label="版本">
          <n-tag type="info" size="small"> {{ version }} </n-tag>
        </n-descriptionsItem>
        <n-descriptionsItem label="最后编译时间">
          <n-tag type="success" size="small"> {{ lastBuildTime }} </n-tag>
        </n-descriptionsItem>
        <n-descriptionsItem label="预览地址">
          <div class="flex items-center">
            <a :href="appConfig.preview" class="text-primary" target="_blank"> 查看预览地址 </a>
          </div>
        </n-descriptionsItem>
        <n-descriptionsItem label="Github">
          <div class="flex h-full items-center">
            <a :href="appConfig.github" class="text-primary" target="_blank"> 查看Github地址 </a>
          </div>
        </n-descriptionsItem>
      </n-descriptions>
    </n-card>

    <n-card title="开发环境依赖" size="small" :segmented="{ content: true }">
      <n-descriptions bordered label-placement="left" class="py-2">
        <n-descriptionsItem v-for="item in devSchema" :key="item.field" :label="item.field">
          {{ item.label }}
        </n-descriptionsItem>
      </n-descriptions>
    </n-card>

    <n-card title="生产环境依赖" size="small" :segmented="{ content: true }">
      <n-descriptions bordered label-placement="left" class="py-2">
        <n-descriptionsItem v-for="item in schema" :key="item.field" :label="item.field">
          {{ item.label }}
        </n-descriptionsItem>
      </n-descriptions>
    </n-card>
  </div>
</template>
