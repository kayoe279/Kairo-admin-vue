<script lang="ts" setup>
import avatar from "@/assets/images/avatar.jpg";
import { cn } from "@/lib";
import { useUserStore } from "@/store";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();

const nickname = computed(() => userStore.userInfo?.user_metadata?.full_name);

const projectList = ref([
  {
    name: "Hearem",
    localIcon: "hearit-logo",
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
    name: "Kairo Website",
    localIcon: "blog-logo",
    description: "Kairo Website",
    link: "https://kairo-website-livid.vercel.app/"
  }
]);

const entranceList = ref([
  {
    name: "主控台",
    icon: "solar:emoji-funny-square-broken",
    link: "/dashboard/console",
    color:
      "from-blue-50/50 to-blue-50/80 hover:from-blue-50 hover:to-blue-100 text-blue-600 dark:from-blue-900/20 dark:to-blue-800/20 dark:text-blue-400"
  },
  {
    name: "基础列表",
    icon: "solar:checklist-minimalistic-outline",
    link: "/basic-list",
    color:
      "from-green-50/50 to-green-50/80 hover:from-green-50 hover:to-green-100 text-green-600 dark:from-green-900/20 dark:to-green-800/20 dark:text-green-400"
  },
  {
    name: "表单页面",
    icon: "solar:document-add-broken",
    link: "/form/basic-form",
    color:
      "from-purple-50/50 to-purple-50/80 hover:from-purple-50 hover:to-purple-100 text-purple-600 dark:from-purple-900/20 dark:to-purple-800/20 dark:text-purple-400"
  },
  {
    name: "权限管理",
    icon: "solar:shield-user-broken",
    link: "/permissions",
    color:
      "from-orange-50/50 to-orange-50/80 hover:from-orange-50 hover:to-orange-100 text-orange-600 dark:from-orange-900/20 dark:to-orange-800/20 dark:text-orange-400"
  },
  {
    name: "系统设置",
    icon: "solar:settings-outline",
    link: "/setting/system",
    color:
      "from-indigo-50/50 to-indigo-50/80 hover:from-indigo-50 hover:to-indigo-100 text-indigo-600 dark:from-indigo-900/20 dark:to-indigo-800/20 dark:text-indigo-400"
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
              <n-avatar
                circle
                :size="80"
                :src="avatar"
                class="shadow-lg ring-4 ring-blue-100 dark:ring-blue-900"
              />
              <span
                class="absolute -right-1 -bottom-1 h-6 w-6 rounded-full border-4 border-white bg-green-500 dark:border-gray-800"
              />
            </div>
            <div class="text-foreground ml-6">
              <h1 class="mb-2 text-2xl font-bold">早安，{{ nickname }} 👋</h1>
              <p class="flex items-center">
                <span class="mr-2">🌤️</span>
                今日多云转晴，20℃ - 30℃，适合出行
              </p>
            </div>
          </div>
        </n-gi>
        <n-gi>
          <div class="flex h-full items-center lg:justify-end">
            <div class="grid grid-cols-3 gap-4 text-center sm:gap-8">
              <div class="min-w-[80px] rounded-full p-4">
                <div class="text-2xl font-bold text-blue-500">12</div>
                <div class="text-foreground-subtle text-sm">项目数</div>
              </div>
              <div class="min-w-[80px] rounded-full p-4">
                <div class="text-2xl font-bold text-orange-500">6/21</div>
                <div class="text-foreground-subtle text-sm">待办</div>
              </div>
              <div class="min-w-[80px] rounded-full p-4">
                <div class="text-2xl font-bold text-green-500">18</div>
                <div class="text-foreground-subtle text-sm">消息</div>
              </div>
            </div>
          </div>
        </n-gi>
      </n-grid>
    </n-card>

    <n-grid cols="1 s:1 m:1 l:2 xl:2 2xl:2" responsive="screen" :x-gap="20" :y-gap="20">
      <!-- 左侧区域 -->
      <n-gi class="space-y-4">
        <n-card class="text-foreground" title="友情链接 👍">
          <div class="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <div
              v-for="item in projectList"
              :key="item.name"
              :title="item.description"
              class="group flex transform cursor-pointer flex-col items-center rounded-2xl bg-gradient-to-b from-gray-50/50 to-gray-50/80 p-6 text-center transition-all duration-300 hover:scale-[1.02] hover:from-blue-50/60 hover:to-blue-50/90 hover:shadow-md dark:from-gray-800/40 dark:to-gray-800/60 dark:hover:from-gray-700/50 dark:hover:to-gray-700/70"
              @click="openInNewWindow(item.link)"
            >
              <SvgIcon
                v-if="item.localIcon"
                :localIcon="item.localIcon"
                class="text-foreground group-hover:text-primary h-[60px] w-[60px] text-[60px] transition-all duration-300 group-hover:scale-110"
              />
              <h3
                class="text-foreground group-hover:text-primary mt-3 mb-1 font-semibold transition-colors duration-300"
              >
                {{ item.name }}
              </h3>
              <p
                class="text-foreground-subtle group-hover:text-primary/80 line-clamp-2 text-xs transition-colors duration-300"
              >
                {{ item.description }}
              </p>
            </div>
          </div>
        </n-card>
        <n-card class="text-foreground" title="最新动态">
          <template #header-extra>
            <button class="text-primary/80 hover:text-primary text-sm font-medium">查看全部</button>
          </template>

          <div class="text-foreground space-y-4">
            <div
              class="bg-background-root flex items-start space-x-4 rounded-2xl p-4 transition-colors"
            >
              <n-avatar circle :size="40" :src="avatar" class="flex-shrink-0" />
              <div class="flex-1">
                <div class="mb-1 flex items-center space-x-2">
                  <span class="font-semibold">Kayoe</span>
                  <span class="text-foreground-subtle text-xs">刚刚</span>
                </div>
                <p class="text-foreground-subtle text-sm">
                  完成了工作台页面的重构，新的设计更加现代化 🎉
                </p>
              </div>
            </div>

            <div
              class="bg-background-root flex items-start space-x-4 rounded-2xl p-4 transition-colors"
            >
              <n-avatar circle :size="40" :src="avatar" class="flex-shrink-0" />
              <div class="flex-1">
                <div class="mb-1 flex items-center space-x-2">
                  <span class="font-semibold">Kayoe</span>
                  <span class="text-foreground-subtle text-xs">2小时前</span>
                </div>
                <p class="text-foreground-subtle text-sm">
                  优化了项目卡片的交互效果，添加了hover动画 ✨
                </p>
              </div>
            </div>

            <div
              class="bg-background-root flex items-start space-x-4 rounded-2xl p-4 transition-colors"
            >
              <n-avatar circle :size="40" :src="avatar" class="flex-shrink-0" />
              <div class="flex-1">
                <div class="mb-1 flex items-center space-x-2">
                  <span class="font-semibold">系统通知</span>
                  <span class="text-foreground-subtle text-xs">今天</span>
                </div>
                <p class="text-foreground-subtle text-sm">有3个新的任务待处理，请及时查看 📋</p>
              </div>
            </div>

            <div
              class="bg-background-root flex items-start space-x-4 rounded-2xl p-4 transition-colors"
            >
              <n-avatar circle :size="40" :src="avatar" class="flex-shrink-0" />
              <div class="flex-1">
                <div class="mb-1 flex items-center space-x-2">
                  <span class="font-semibold">团队协作</span>
                  <span class="text-foreground-subtle text-xs">昨天</span>
                </div>
                <p class="text-foreground-subtle text-sm">代码审查已完成，可以进行下一步部署 🚀</p>
              </div>
            </div>
          </div>
        </n-card>
      </n-gi>

      <!-- 右侧区域 -->
      <n-gi class="space-y-4">
        <n-card title="快捷入口">
          <div
            class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
          >
            <button
              v-for="item in entranceList"
              :key="item.name"
              type="button"
              :class="
                cn(
                  'group flex aspect-square transform cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl bg-gradient-to-br p-4 transition-all duration-300',
                  item.color
                )
              "
              @click="navigateTo(item.link)"
            >
              <SvgIcon
                :icon="item.icon"
                class="text-4xl transition-all duration-300 group-hover:scale-110"
              />
              <h3 class="text-sm font-semibold">{{ item.name }}</h3>
            </button>
          </div>
        </n-card>

        <n-card class="flex h-[510px] items-center justify-center text-gray-400">
          <div class="flex h-full w-full items-center justify-center">
            <SvgIcon localIcon="logo" class="size-30" />
          </div>
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>
