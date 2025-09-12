<script lang="ts" setup>
import { appConfig, defaultLoginParams } from "@/lib/settings/app";
import { login } from "@/service/api/auth/login";
import { useUserStore } from "@/store";
import { useRequest } from "alova/client";
import { motion } from "motion-v";
import { useMessage } from "naive-ui";
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const formRef = ref();
const message = useMessage();
const rememberMe = ref(true);

const formValue = reactive({
  ...defaultLoginParams,
  isCaptcha: true
});

const rules = computed(() => ({
  username: { required: true, message: t("login.usernamePlaceholder"), trigger: "blur" },
  password: { required: true, message: t("login.passwordPlaceholder"), trigger: "blur" }
}));

const { loading, data, send } = useRequest(login, { immediate: false });

const userStore = useUserStore();

// 响应式窗口尺寸
const windowWidth = ref(typeof window !== "undefined" ? window.innerWidth : 1920);
const windowHeight = ref(typeof window !== "undefined" ? window.innerHeight : 1080);

// 粒子配置
const particleCount = ref(20);

onMounted(() => {
  if (typeof window !== "undefined") {
    const updateWindowSize = () => {
      windowWidth.value = window.innerWidth;
      windowHeight.value = window.innerHeight;
      // 根据屏幕大小调整粒子数量
      particleCount.value = window.innerWidth < 768 ? 10 : 20;
    };

    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);

    return () => {
      window.removeEventListener("resize", updateWindowSize);
    };
  }
});

// 生成随机位置的函数
const getRandomPosition = (dimension: "width" | "height") => {
  const size = dimension === "width" ? windowWidth.value : windowHeight.value;
  return Math.random() * size;
};

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value.validate(async (errors) => {
    if (!errors) {
      message.loading(t("login.loginLoading"));
      await send({
        username: formValue.username,
        password: formValue.password
      });

      const result = data.value;
      message.destroyAll();
      if (result.code === 200) {
        message.success(t("login.loginSuccess"));
        userStore.updateUserInfo(result.data);
      } else {
        message.error(t("login.loginError"));
      }
    } else {
      message.error(t("login.loginErrorTip"));
    }
  });
};
</script>

<template>
  <div
    class="loginContainer relative flex h-screen w-screen items-center justify-center overflow-hidden"
  >
    <!-- 主要背景渐变 -->
    <!-- <motion.div
      class="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{ duration: 1 }"
    /> -->

    <!-- 登录卡片容器 -->
    <motion.div
      class="relative z-10 mx-4 w-[90%] max-w-md sm:mx-0"
      :initial="{ scale: 0.8, opacity: 0, y: 50 }"
      :animate="{ scale: 1, opacity: 1, y: 0 }"
      :transition="{ duration: 0.8, ease: 'easeOut' }"
    >
      <!-- 卡片背景 -->
      <motion.div
        class="relative overflow-hidden rounded-3xl border border-white/20 bg-white/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8 dark:bg-gray-800/80"
        :whileHover="{ scale: 1.02, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }"
        :transition="{ duration: 0.3 }"
      >
        <!-- 卡片装饰元素 -->
        <motion.div
          class="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl"
          :animate="{ rotate: 360 }"
          :transition="{ duration: 20, repeat: Infinity, ease: 'linear' }"
        />

        <motion.div
          class="absolute -bottom-10 -left-10 h-16 w-16 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-xl"
          :animate="{ rotate: -360 }"
          :transition="{ duration: 25, repeat: Infinity, ease: 'linear' }"
        />

        <!-- 头部区域 -->
        <motion.div
          class="mb-6 text-center sm:mb-8"
          :initial="{ opacity: 0, y: -20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6, delay: 0.2 }"
        >
          <motion.div
            :initial="{ scale: 0, rotate: -180 }"
            :animate="{ scale: 1, rotate: 0 }"
            :transition="{ duration: 0.8, delay: 0.3, ease: 'easeOut' }"
            :whileHover="{ scale: 1.1, rotate: 5 }"
            class="mb-4 inline-block"
          >
            <SvgIcon localIcon="logo" class="size-12 sm:size-16" />
          </motion.div>

          <motion.h1
            class="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl"
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: 0.4 }"
          >
            {{ appConfig.title }}
          </motion.h1>

          <motion.p
            class="text-sm text-gray-600 sm:text-base dark:text-gray-300"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :transition="{ duration: 0.6, delay: 0.5 }"
          >
            {{ appConfig.loginDesc }}
          </motion.p>
        </motion.div>

        <!-- 表单区域 -->
        <motion.div
          :initial="{ opacity: 0, y: 30 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6, delay: 0.6 }"
        >
          <n-form
            ref="formRef"
            class="space-y-4"
            label-placement="left"
            size="large"
            :model="formValue"
            :rules="rules"
          >
            <motion.div
              :initial="{ x: -50, opacity: 0 }"
              :animate="{ x: 0, opacity: 1 }"
              :transition="{ duration: 0.5, delay: 0.7 }"
              :whileHover="{ scale: 1.02 }"
              :whileFocus="{ scale: 1.02 }"
            >
              <n-form-item path="username">
                <n-input
                  v-model:value="formValue.username"
                  :placeholder="$t('login.usernamePlaceholder')"
                  class="h-full rounded-xl border-0 bg-gray-50/50 dark:bg-gray-700/50"
                >
                  <template #prefix>
                    <motion.div
                      :whileHover="{ scale: 1.2, rotate: 10 }"
                      :transition="{ duration: 0.2 }"
                    >
                      <SvgIcon icon="solar:user-broken" class="mr-2 text-xl text-blue-500" />
                    </motion.div>
                  </template>
                </n-input>
              </n-form-item>
            </motion.div>

            <motion.div
              :initial="{ x: -50, opacity: 0 }"
              :animate="{ x: 0, opacity: 1 }"
              :transition="{ duration: 0.5, delay: 0.8 }"
              :whileHover="{ scale: 1.02 }"
              :whileFocus="{ scale: 1.02 }"
            >
              <n-form-item path="password">
                <n-input
                  v-model:value="formValue.password"
                  type="password"
                  showPasswordOn="click"
                  :placeholder="$t('login.passwordPlaceholder')"
                  class="h-full rounded-xl border-0 bg-gray-50/50 dark:bg-gray-700/50"
                >
                  <template #prefix>
                    <motion.div
                      :whileHover="{ scale: 1.2, rotate: -10 }"
                      :transition="{ duration: 0.2 }"
                    >
                      <SvgIcon
                        icon="solar:lock-password-unlocked-broken"
                        class="mr-2 text-xl text-purple-500"
                      />
                    </motion.div>
                  </template>
                </n-input>
              </n-form-item>
            </motion.div>

            <motion.div
              :initial="{ opacity: 0 }"
              :animate="{ opacity: 1 }"
              :transition="{ duration: 0.5, delay: 0.9 }"
              :whileHover="{ x: 5 }"
            >
              <n-form-item>
                <n-checkbox v-model:checked="rememberMe" class="text-gray-600 dark:text-gray-300">
                  {{ $t("login.rememberMe") }}
                </n-checkbox>
              </n-form-item>
            </motion.div>

            <motion.div
              :initial="{ y: 30, opacity: 0 }"
              :animate="{ y: 0, opacity: 1 }"
              :transition="{ duration: 0.5, delay: 1 }"
            >
              <n-form-item>
                <motion.div
                  class="w-full"
                  :whileHover="{ scale: 1.05 }"
                  :whileTap="{ scale: 0.95 }"
                  :transition="{ duration: 0.2 }"
                >
                  <n-button
                    type="primary"
                    @click="handleSubmit"
                    size="large"
                    :loading="loading"
                    block
                    class="h-12 rounded-xl border-0 font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    {{ $t("login.loginButton") }}
                  </n-button>
                </motion.div>
              </n-form-item>
            </motion.div>
          </n-form>
        </motion.div>

        <!-- 底部工具区域 -->
        <motion.div
          class="mt-8 flex items-center justify-center gap-6"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :transition="{ duration: 0.6, delay: 1.1 }"
        >
          <motion.div
            :whileHover="{ scale: 1.1, rotate: 10 }"
            :whileTap="{ scale: 0.9 }"
            :transition="{ duration: 0.2 }"
          >
            <ThemeSwitch />
          </motion.div>

          <motion.div
            :whileHover="{ scale: 1.1, rotate: -10 }"
            :whileTap="{ scale: 0.9 }"
            :transition="{ duration: 0.2 }"
          >
            <LanguageSwitch />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  </div>
</template>

<style scoped>
.loginContainer::before {
  content: "";
  height: 100vh;
  width: 100vw;
  position: fixed;
  background:
    linear-gradient(90deg, var(--fg-base) 1px, transparent 1px var(--size)) 50% 50% / 45px 45px,
    linear-gradient(var(--fg-base) 1px, transparent 1px 45px) 50% 50% / 45px 45px;
  mask: linear-gradient(-20deg, transparent 50%, white);
  top: 0;
  transform-style: flat;
  pointer-events: none;
  z-index: -1;
  opacity: 0.5;
}
</style>
