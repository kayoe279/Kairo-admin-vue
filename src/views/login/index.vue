<script lang="ts" setup>
import { appConfig, defaultLoginParams } from "@/lib/settings/app";
import { login } from "@/service/api/login";
import { useUserStore } from "@/store";
import { useRequest } from "alova/client";
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
  username: { required: true, message: t("login.usernamePlaceholder"), trigger: "blur" },
  password: { required: true, message: t("login.passwordPlaceholder"), trigger: "blur" }
}));

const { loading, data, send } = useRequest(login, { immediate: false });

const userStore = useUserStore();

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
        userStore.handleLoginInfo(result.data);
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
  <div class="loginContainer flex h-screen w-screen items-center justify-center">
    <div
      class="text-foreground bg-background relative flex w-[88%] flex-col items-center justify-center rounded-2xl p-6 shadow-lg inset-shadow-2xs sm:w-[424px]"
    >
      <div class="bg-primary/80 absolute -top-24 left-17 h-24 w-48 rounded-t-full" />
      <div class="bg-primary/80 absolute top-0 left-65 h-12 w-24 rounded-b-full" />

      <div class="my-10 flex flex-col items-center justify-center">
        <SvgIcon localIcon="logo" class="size-25" />
        <h1 class="mb-2 text-3xl font-bold">{{ appConfig.title }}</h1>
        <p class="text-foreground">{{ appConfig.loginDesc }}</p>
      </div>
      <n-form
        ref="formRef"
        class="w-full"
        label-placement="left"
        size="large"
        :model="formValue"
        :rules="rules"
      >
        <n-form-item path="username">
          <n-input
            v-model:value="formValue.username"
            :placeholder="$t('login.usernamePlaceholder')"
          >
            <template #prefix>
              <SvgIcon icon="solar:user-broken" class="text-xl" />
            </template>
          </n-input>
        </n-form-item>
        <n-form-item path="password">
          <n-input
            v-model:value="formValue.password"
            type="password"
            showPasswordOn="click"
            :placeholder="$t('login.passwordPlaceholder')"
          >
            <template #prefix>
              <SvgIcon icon="solar:lock-password-unlocked-broken" class="text-xl" />
            </template>
          </n-input>
        </n-form-item>
        <n-form-item>
          <n-checkbox v-model:checked="rememberMe">{{ $t("login.rememberMe") }}</n-checkbox>
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="handleSubmit" size="large" :loading="loading" block>
            {{ $t("login.loginButton") }}
          </n-button>
        </n-form-item>
      </n-form>

      <div class="my-5 flex items-center justify-center gap-x-10">
        <ThemeSwitch />
        <LanguageSwitch />
      </div>
    </div>
  </div>
</template>

<style scoped>
.loginContainer::before {
  content: "";
  height: 100vh;
  width: 100vw;
  position: fixed;
  background:
    linear-gradient(90deg, var(--foreground) 1px, transparent 1px var(--size)) 50% 50% / 45px 45px,
    linear-gradient(var(--foreground) 1px, transparent 1px 45px) 50% 50% / 45px 45px;
  mask: linear-gradient(-20deg, transparent 50%, white);
  top: 0;
  transform-style: flat;
  pointer-events: none;
  z-index: -1;
  opacity: 0.5;
}
</style>
