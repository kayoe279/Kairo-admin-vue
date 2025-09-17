<script lang="ts" setup>
import { cn } from "@/lib";
import { defaultLoginParams } from "@/lib/settings/app";
import { login } from "@/service/api";
import { useUserStore } from "@/store";
import { useRequest } from "alova/client";
import { motion } from "motion-v";
import { useMessage } from "naive-ui";
import { computed, reactive, ref } from "vue";
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
  username: { required: true, message: t("auth.usernamePlaceholder"), trigger: "blur" },
  password: { required: true, message: t("auth.passwordPlaceholder"), trigger: "blur" }
}));

const { loading, data, send } = useRequest(login, { immediate: false });

const userStore = useUserStore();

// 处理卡片悬停效果
const isCardHovered = ref(false);
const onCardHover = (hovered: boolean) => {
  isCardHovered.value = hovered;
};

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value.validate(async (errors) => {
    if (!errors) {
      message.loading(t("auth.loginLoading"));
      await send({
        username: formValue.username,
        password: formValue.password
      });

      const result = data.value;
      message.destroyAll();
      if (result.code === 200) {
        message.success(t("auth.loginSuccess"));
        userStore.updateUserInfo(result.data);
      } else {
        message.error(t("auth.loginError"));
      }
    } else {
      message.error(t("auth.loginErrorTip"));
    }
  });
};
</script>

<template>
  <div
    class="bg-background-root relative flex h-screen w-screen items-center justify-center overflow-hidden"
  >
    <LoginBanner :class="cn(isCardHovered ? 'scale-y-100' : 'scale-y-0')" />

    <motion.div
      class="bg-background/90 text-fg-base relative z-10 mx-4 w-[90%] max-w-md rounded-3xl p-6 shadow-2xl backdrop-blur-2xl sm:mx-0"
      :initial="{ scale: 0.8, opacity: 0 }"
      :animate="{ scale: 1, opacity: 1 }"
      :transition="{ duration: 0.3 }"
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

      <motion.div
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.6 }"
      >
        <NForm
          ref="formRef"
          class="space-y-2"
          label-placement="left"
          size="large"
          :model="formValue"
          :rules="rules"
        >
          <NFormItem path="username">
            <NInput
              v-model:value="formValue.username"
              :placeholder="$t('auth.usernamePlaceholder')"
            >
              <template #prefix>
                <SvgIcon icon="solar:user-broken" class="mr-3 text-lg" />
              </template>
            </NInput>
          </NFormItem>

          <NFormItem path="password">
            <NInput
              v-model:value="formValue.password"
              type="password"
              showPasswordOn="click"
              :placeholder="$t('auth.passwordPlaceholder')"
            >
              <template #prefix>
                <SvgIcon icon="solar:lock-password-unlocked-broken" class="mr-3 text-lg" />
              </template>
            </NInput>
          </NFormItem>

          <NCheckbox v-model:checked="rememberMe">
            {{ $t("auth.rememberMe") }}
          </NCheckbox>

          <NFormItem>
            <NButton
              type="primary"
              @click="handleSubmit"
              size="large"
              block
              :loading="loading"
              class="!mt-4"
            >
              {{ $t("auth.loginButton") }}
            </NButton>
          </NFormItem>
        </NForm>
      </motion.div>

      <!-- 底部工具区域 - 简化版 -->
      <motion.div
        class="mt-8 flex items-center justify-center gap-4"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="{ duration: 0.6, delay: 0.8 }"
      >
        <ThemeSwitch />
        <LanguageSwitch />
      </motion.div>
    </motion.div>
  </div>
</template>
