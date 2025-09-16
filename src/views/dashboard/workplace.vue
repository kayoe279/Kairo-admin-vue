<script lang="ts" setup>
import avatar from "@/assets/images/avatar.jpg";
import { cn } from "@/lib";
import { useUserStore } from "@/store";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();

const nickname = computed(() => userStore.userInfo?.nickname);

const projectList = ref([
  {
    name: "Hearem",
    localIcon: "hearem-logo",
    description: "AI智能可定制地将文字转为自然人声",
    link: "https://hearem.cc/en"
  },
  {
    name: "Amoihub",
    localIcon: "amoihub-logo",
    description: "将生成式AI的提示词统一管理",
    link: "https://www.amoihub.com/"
  },
  {
    name: "Blog",
    localIcon: "blog-logo",
    description: "Kayoe 博客",
    link: "https://kayoe-blog.vercel.app/"
  }
]);

const entranceList = ref([
  {
    name: "主控台",
    icon: "solar:emoji-funny-square-broken",
    link: "/dashboard/console",
    color: "from-blue-400 to-blue-600"
  },
  {
    name: "基础列表",
    icon: "solar:checklist-minimalistic-outline",
    link: "/basic-list",
    color: "from-green-400 to-green-600"
  },
  {
    name: "表单页面",
    icon: "solar:document-add-broken",
    link: "/form/basic-form",
    color: "from-purple-400 to-purple-600"
  },
  {
    name: "权限管理",
    icon: "solar:shield-user-broken",
    link: "/permissions",
    color: "from-orange-400 to-orange-600"
  },
  {
    name: "系统设置",
    icon: "solar:settings-outline",
    link: "/setting/system",
    color: "from-indigo-400 to-indigo-600"
  }
]);

const navigateTo = (path: string) => {
  router.push(path);
};

const openInNewWindow = (url: string) => {
  window.open(url, "_blank");
};
</script>

<template>
  <div class="space-y-4">
    <!-- 顶部信息区域 -->
    <n-card>
      <n-grid cols="1 s:1 m:1 l:2 xl:2 2xl:2" responsive="screen" :x-gap="20">
        <n-gi>
          <div class="flex items-center">
            <div class="relative">
              <n-avatar circle :size="80" :src="avatar" class="shadow-lg ring-4 ring-blue-100" />
              <span
                class="absolute -right-1 -bottom-1 h-6 w-6 rounded-full border-4 border-white bg-green-500"
              />
            </div>
            <div class="text-fg-base ml-6">
              <h1 class="mb-2 text-2xl font-bold">早安，{{ nickname }} 👋</h1>
              <p class="flex items-center">
                <span class="mr-2">🌤️</span>
                今日多云转晴，20℃ - 30℃，适合出行
              </p>
            </div>
          </div>
        </n-gi>
        <n-gi>
          <div class="flex h-full items-center justify-end">
            <div class="grid grid-cols-3 gap-8 text-center">
              <div class="min-w-[80px] rounded-full bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                <div class="text-2xl font-bold text-blue-500">12</div>
                <div class="text-fg-subtle text-sm">项目数</div>
              </div>
              <div
                class="min-w-[80px] rounded-full bg-gradient-to-br from-orange-50 to-orange-100 p-4"
              >
                <div class="text-2xl font-bold text-orange-500">6/21</div>
                <div class="text-fg-subtle text-sm">待办</div>
              </div>
              <div
                class="min-w-[80px] rounded-full bg-gradient-to-br from-green-50 to-green-100 p-4"
              >
                <div class="text-2xl font-bold text-green-500">18</div>
                <div class="text-fg-subtle text-sm">消息</div>
              </div>
            </div>
          </div>
        </n-gi>
      </n-grid>
    </n-card>

    <n-grid cols="1 s:1 m:1 l:2 xl:2 2xl:2" responsive="screen" :x-gap="20" :y-gap="20">
      <!-- 左侧区域 -->
      <n-gi class="space-y-4">
        <n-card class="text-fg-base" title="友情链接 👍">
          <div class="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <div
              v-for="item in projectList"
              :key="item.name"
              :title="item.description"
              class="group text-fg-subtle hover:text-primary dark:from-background dark:to-background flex transform cursor-pointer flex-col items-center rounded-xl bg-gradient-to-b from-blue-100/50 to-white p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl"
              @click="openInNewWindow(item.link)"
            >
              <SvgIcon
                v-if="item.localIcon"
                :localIcon="item.localIcon"
                class="text-fg-base group-hover:text-primary h-[60px] w-[60px] text-[60px]"
              />
              <h3 class="text-fg-base group-hover:text-primary mt-2 mb-1 font-semibold">
                {{ item.name }}
              </h3>
              <p class="text-fg-subtle group-hover:text-primary line-clamp-1 text-xs">
                {{ item.description }}
              </p>
            </div>
          </div>
        </n-card>
        <n-card class="text-fg-base" title="最新动态">
          <template #header-extra>
            <button class="text-primary/80 hover:text-primary text-sm font-medium">查看全部</button>
          </template>

          <div class="text-fg-base space-y-4">
            <div
              class="bg-background-root flex items-start space-x-4 rounded-2xl p-4 transition-colors"
            >
              <n-avatar circle :size="40" :src="avatar" class="flex-shrink-0" />
              <div class="flex-1">
                <div class="mb-1 flex items-center space-x-2">
                  <span class="font-semibold">Kayoe</span>
                  <span class="text-fg-subtle text-xs">刚刚</span>
                </div>
                <p class="text-fg-subtle text-sm">完成了工作台页面的重构，新的设计更加现代化 🎉</p>
              </div>
            </div>

            <div
              class="bg-background-root flex items-start space-x-4 rounded-2xl p-4 transition-colors"
            >
              <n-avatar circle :size="40" :src="avatar" class="flex-shrink-0" />
              <div class="flex-1">
                <div class="mb-1 flex items-center space-x-2">
                  <span class="font-semibold">Kayoe</span>
                  <span class="text-fg-subtle text-xs">2小时前</span>
                </div>
                <p class="text-fg-subtle text-sm">优化了项目卡片的交互效果，添加了hover动画 ✨</p>
              </div>
            </div>

            <div
              class="bg-background-root flex items-start space-x-4 rounded-2xl p-4 transition-colors"
            >
              <n-avatar circle :size="40" :src="avatar" class="flex-shrink-0" />
              <div class="flex-1">
                <div class="mb-1 flex items-center space-x-2">
                  <span class="font-semibold">系统通知</span>
                  <span class="text-fg-subtle text-xs">今天</span>
                </div>
                <p class="text-fg-subtle text-sm">有3个新的任务待处理，请及时查看 📋</p>
              </div>
            </div>

            <div
              class="bg-background-root flex items-start space-x-4 rounded-2xl p-4 transition-colors"
            >
              <n-avatar circle :size="40" :src="avatar" class="flex-shrink-0" />
              <div class="flex-1">
                <div class="mb-1 flex items-center space-x-2">
                  <span class="font-semibold">团队协作</span>
                  <span class="text-fg-subtle text-xs">昨天</span>
                </div>
                <p class="text-fg-subtle text-sm">代码审查已完成，可以进行下一步部署 🚀</p>
              </div>
            </div>
          </div>
        </n-card>
      </n-gi>

      <!-- 右侧区域 -->
      <n-gi class="space-y-4">
        <n-card title="快捷入口">
          <div
            class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 2xl:grid-cols-5"
          >
            <button
              v-for="item in entranceList"
              :key="item.name"
              type="button"
              :class="
                cn(
                  'group flex w-32 transform cursor-pointer items-center justify-center gap-x-2 rounded-3xl bg-gradient-to-br py-2 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl',
                  item.color
                )
              "
              @click="navigateTo(item.link)"
            >
              <SvgIcon :icon="item.icon" class="text-2xl" />
              <h3 class="mt-2 mb-1 font-semibold">{{ item.name }}</h3>
            </button>
          </div>
        </n-card>

        <n-card class="flex h-[510px] items-center justify-center text-gray-400">
          <div class="flex h-full w-full items-center justify-center">
            <SvgIcon localIcon="logo" class="mb-4 text-6xl" />
          </div>
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>
