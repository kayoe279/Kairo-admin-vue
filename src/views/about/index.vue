<script lang="ts" setup>
import { appConfig } from "@/lib/settings/app";
import { NDescriptionsItem } from "naive-ui";

export interface schemaItem {
  field: string;
  label: string;
}

const { pkg, lastBuildTime } = appInfo;
const { dependencies, devDependencies, version, author } = pkg;

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
    <NCard title="关于">
      {{ appConfig.description }}
    </NCard>

    <NCard title="项目信息" class="proCard mt-4" size="small" :segmented="{ content: true }">
      <NDescriptions bordered label-placement="left" class="py-2">
        <NDescriptionsItem label="项目名称">
          {{ appConfig.title }}
        </NDescriptionsItem>
        <NDescriptionsItem label="作者">
          {{ author.name }}
        </NDescriptionsItem>
        <NDescriptionsItem label="邮箱">
          {{ author.email }}
        </NDescriptionsItem>
        <NDescriptionsItem label="版本">
          <NTag type="info" size="small"> {{ version }} </NTag>
        </NDescriptionsItem>
        <NDescriptionsItem label="最后编译时间">
          <NTag type="success" size="small"> {{ lastBuildTime }} </NTag>
        </NDescriptionsItem>
        <NDescriptionsItem label="预览地址">
          <div class="flex items-center">
            <a :href="appConfig.preview" class="text-primary" target="_blank"> 查看预览地址 </a>
          </div>
        </NDescriptionsItem>
        <NDescriptionsItem label="Github">
          <div class="flex h-full items-center">
            <a :href="appConfig.github" class="text-primary" target="_blank"> 查看Github地址 </a>
          </div>
        </NDescriptionsItem>
      </NDescriptions>
    </NCard>

    <NCard title="开发环境依赖" size="small" :segmented="{ content: true }">
      <NDescriptions bordered label-placement="left" class="py-2">
        <NDescriptionsItem v-for="item in devSchema" :key="item.field" :label="item.field">
          {{ item.label }}
        </NDescriptionsItem>
      </NDescriptions>
    </NCard>

    <NCard title="生产环境依赖" size="small" :segmented="{ content: true }">
      <NDescriptions bordered label-placement="left" class="py-2">
        <NDescriptionsItem v-for="item in schema" :key="item.field" :label="item.field">
          {{ item.label }}
        </NDescriptionsItem>
      </NDescriptions>
    </NCard>
  </div>
</template>
