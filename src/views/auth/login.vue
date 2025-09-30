<script setup lang="ts">
import EmailVerification from "@/components/features/auth/EmailVerification.vue";
import LoginForm from "@/components/features/auth/LoginForm.vue";
import type { LoginCredentials } from "@/components/features/auth/LoginForm.vue";
import RegisterForm from "@/components/features/auth/RegisterForm.vue";
import type { RegisterCredentials } from "@/components/features/auth/RegisterForm.vue";
import { cn } from "@/lib";
import { appConfig } from "@/lib/settings/app";
import { useSignIn, useSignUp } from "@/service/api/auth";
import { useUserStore } from "@/store";
import { motion } from "motion-v";
import { useMessage } from "naive-ui";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

type ViewType = "login" | "register" | "verify";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const message = useMessage();
const userStore = useUserStore();

// 状态管理
const currentView = ref<ViewType>("login");
const isCardHovered = ref(false);
const registeredEmail = ref("");

// 认证相关的mutation hooks
const { isPending: isSignInPending, mutateAsync: signIn } = useSignIn();
const { isPending: isSignUpPending, mutateAsync: signUp } = useSignUp();

// 卡片悬停处理
const onCardHover = (hovered: boolean) => {
  isCardHovered.value = hovered;
};

// 更新路由参数
const updateRouteQuery = (type: ViewType, email?: string) => {
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

const handleSwitchView = (type: ViewType, email?: string) => {
  currentView.value = type;
  updateRouteQuery(type, email);
};

// 验证成功处理
const onVerifySuccess = () => {
  message.success(t("auth.verifySuccess"));
  handleSwitchView("login");
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
    handleSwitchView("verify", values.email);
  } catch (error) {
    message.error(`${t("auth.registerFailed")}: ${error}`);
  }
};

// 动态高度计算
const cardHeight = computed(() => {
  switch (currentView.value) {
    case "login":
      return 520;
    case "register":
      return 650;
    case "verify":
      return 610;
    default:
      return 520;
  }
});

// 从路由参数初始化视图状态
const initializeViewFromRoute = () => {
  const type = route.query.type as ViewType;
  const email = route.query.email as string;
  currentView.value = type || "login";
  registeredEmail.value = email || "";
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
          className="flex flex-col items-center"
        >
          <SvgIcon localIcon="logo" class="size-30" />
          <span className="font-poppins text-3xl font-medium">{{ appConfig.title }}</span>
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
              v-if="currentView === 'register'"
              :loading="isSignUpPending"
              @finish="onRegisterFinish"
            />
            <EmailVerification
              v-if="currentView === 'verify'"
              :email="registeredEmail"
              @verifySuccess="onVerifySuccess"
            />
          </div>
        </Transition>
      </div>

      <motion.div
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
            <n-button text type="primary" @click="handleSwitchView('register')" class="!pl-1">
              {{ t("auth.register") }}
            </n-button>
          </div>
          <div v-else-if="currentView === 'register'" key="switch-to-login">
            <span class="text-foreground-subtle text-sm">
              {{ t("auth.haveAccountText") }}
            </span>
            <n-button text type="primary" @click="handleSwitchView('login')" class="!pl-1">
              {{ t("auth.loginButton") }}
            </n-button>
          </div>
          <div v-else key="switch-to-verify">
            <n-button text type="primary" @click="handleSwitchView('register')" class="!mt-4 !pl-1">
              {{ $t("auth.backToRegister") }}
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
