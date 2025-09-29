<script setup lang="ts">
import EmailVerification from "@/components/features/auth/EmailVerification.vue";
import LoginForm from "@/components/features/auth/LoginForm.vue";
import type { LoginCredentials } from "@/components/features/auth/LoginForm.vue";
import RegisterForm from "@/components/features/auth/RegisterForm.vue";
import type { RegisterCredentials } from "@/components/features/auth/RegisterForm.vue";
import { cn } from "@/lib";
import { useSignIn, useSignUp } from "@/service/api/auth";
import { useUserStore } from "@/store";
import { motion } from "motion-v";
import { NButton, useMessage } from "naive-ui";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const message = useMessage();
const userStore = useUserStore();

// 状态管理
const currentView = ref<"login" | "register" | "verify">("login");
const isCardHovered = ref(false);
const registeredEmail = ref("");

// 从路由参数初始化视图状态
const initializeViewFromRoute = () => {
  const type = route.query.type as string;
  const email = route.query.email as string;

  if (type === "verify" && email) {
    currentView.value = "verify";
    registeredEmail.value = email;
  } else if (type === "register") {
    currentView.value = "register";
  } else {
    currentView.value = "login";
  }
};

// 组件挂载时初始化
onMounted(() => {
  initializeViewFromRoute();
});

// 监听路由变化
watch(
  () => route.query,
  () => {
    initializeViewFromRoute();
  },
  { immediate: true }
);

// 认证相关的mutation hooks
const { isPending: isSignInPending, mutateAsync: signIn } = useSignIn();
const { isPending: isSignUpPending, mutateAsync: signUp } = useSignUp();

// 卡片悬停处理
const onCardHover = (hovered: boolean) => {
  isCardHovered.value = hovered;
};

// 更新路由参数
const updateRouteQuery = (type: "login" | "register" | "verify", email?: string) => {
  const query: Record<string, string> = { type };
  if (type === "verify" && email) {
    query.email = email;
  }

  router.replace({
    path: route.path,
    query: {
      ...route.query,
      ...query
    }
  });
};

// 视图切换
const switchToRegister = () => {
  currentView.value = "register";
  updateRouteQuery("register");
};

const switchToLogin = () => {
  currentView.value = "login";
  updateRouteQuery("login");
};

const switchToVerify = (email: string) => {
  registeredEmail.value = email;
  currentView.value = "verify";
  updateRouteQuery("verify", email);
};

const switchBackToRegister = () => {
  currentView.value = "register";
  updateRouteQuery("register");
};

// 验证成功处理
const onVerifySuccess = () => {
  message.success(t("auth.verifySuccess"));
  currentView.value = "login";
  updateRouteQuery("login");
};

// 登录处理
const onLoginFinish = async (values: LoginCredentials) => {
  try {
    const result = await signIn({
      email: values.email,
      password: values.password
    });

    if (result.error) {
      message.error(`${t("auth.loginFailed")}: ${result.error.message}`);
      return;
    }

    const user = result.user;

    if (user) {
      await userStore.updateUserInfo(user);
      message.success(t("auth.loginSuccess"));

      const redirectUrl = route.query?.redirect || route.query?.from || "/";
      router.replace(typeof redirectUrl === "string" ? redirectUrl : "/");
    }
  } catch (error) {
    message.error(`${t("auth.loginFailed")}: ${error}`);
  }
};

// 注册处理
const onRegisterFinish = async (values: RegisterCredentials) => {
  try {
    const result = await signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: (values as any)?.fullName,
          roles: ["user"]
        }
      }
    });

    if (result.error) {
      message.error(`${t("auth.registerFailed")}: ${result.error?.message}`);
      return;
    }

    message.success(t("auth.registerSuccess"));
    switchToVerify(values.email);
  } catch (error) {
    message.error(`${t("auth.registerFailed")}: ${error}`);
  }
};

// 重新发送验证码
const onResendCode = () => {
  message.success(t("auth.resendCodeSuccess"));
};

// 动态高度计算
const cardHeight = computed(() => {
  switch (currentView.value) {
    case "login":
      return 500;
    case "register":
      return 620;
    case "verify":
      return 580;
    default:
      return 500;
  }
});
</script>

<template>
  <div
    class="bg-background-root text-foreground relative flex h-screen w-screen items-center justify-center overflow-hidden"
  >
    <LoginBanner :class="cn(isCardHovered ? 'scale-y-100' : 'scale-y-0')" />

    <motion.div
      class="bg-background/90 text-foreground relative z-10 mx-4 w-[90%] max-w-md rounded-3xl p-6 shadow-2xl backdrop-blur-2xl sm:mx-0"
      :initial="{ scale: 0.8, opacity: 0 }"
      :animate="{
        scale: 1,
        opacity: 1,
        height: cardHeight
      }"
      :transition="{
        duration: 0.3,
        height: {
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1],
          delay: 0.15
        }
      }"
      @mouseenter="onCardHover(true)"
      @mouseleave="onCardHover(false)"
    >
      <motion.div
        class="mb-8 text-center"
        :initial="{ opacity: 0, y: -10 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.2 }"
      >
        <motion.div
          :initial="{ scale: 0.9, opacity: 0 }"
          :animate="{ scale: 1, opacity: 1 }"
          :transition="{ duration: 0.6 }"
          class="inline-block"
        >
          <SvgIcon localIcon="logo" class="size-30" />
        </motion.div>
      </motion.div>

      <div class="relative overflow-hidden">
        <Transition
          mode="out-in"
          enter-active-class="transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          leave-active-class="transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          enter-from-class="opacity-0 translate-y-8 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 -translate-y-8 scale-95"
        >
          <div :key="currentView">
            <LoginForm
              v-if="currentView === 'login'"
              :loading="isSignInPending"
              @finish="onLoginFinish"
            />
            <RegisterForm
              v-else-if="currentView === 'register'"
              :loading="isSignUpPending"
              @finish="onRegisterFinish"
            />
            <EmailVerification
              v-else
              :email="registeredEmail"
              @verifySuccess="onVerifySuccess"
              @back="switchBackToRegister"
            />
          </div>
        </Transition>
      </div>

      <motion.div
        v-if="currentView !== 'verify'"
        class="text-center"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="{ duration: 0.6, delay: 0.8 }"
      >
        <Transition
          mode="out-in"
          enter-active-class="transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          leave-active-class="transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="currentView === 'login'" key="switch-to-register">
            <span class="text-foreground-subtle text-sm">
              {{ t("auth.noAccountText") }}
            </span>
            <n-button text type="primary" @click="switchToRegister" class="!p-0">
              {{ t("auth.register") }}
            </n-button>
          </div>
          <div v-else key="switch-to-login">
            <span class="text-foreground-subtle text-sm">
              {{ t("auth.haveAccountText") }}
            </span>
            <n-button text type="primary" @click="switchToLogin" class="!p-0">
              {{ t("auth.loginButton") }}
            </n-button>
          </div>
        </Transition>
      </motion.div>

      <motion.div
        class="absolute right-6 bottom-6 left-6 flex items-center justify-center gap-4"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="{ duration: 0.6, delay: 1.0 }"
      >
        <ThemeSwitch />
        <LanguageSwitch />
      </motion.div>
    </motion.div>
  </div>
</template>
