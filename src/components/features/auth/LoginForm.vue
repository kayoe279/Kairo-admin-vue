<script setup lang="ts">
import { NButton, NCheckbox, NForm, NFormItem, NInput } from "naive-ui";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

type LoginFormProps = {
  loading?: boolean;
  initialValues?: Partial<LoginCredentials>;
};

withDefaults(defineProps<LoginFormProps>(), {
  loading: false,
  initialValues: () => ({})
});

const emit = defineEmits<{
  finish: [values: LoginCredentials];
}>();

const formRef = ref();
const formValue = ref<LoginCredentials>({
  email: "",
  password: "",
  remember: true
});

const rules = computed(() => ({
  email: [
    { required: true, message: t("auth.emailPlaceholder"), trigger: "blur" },
    {
      validator: (rule: any, value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          return new Error(t("auth.emailInvalid"));
        }
        return true;
      },
      trigger: ["blur", "change"]
    }
  ],
  password: [
    { required: true, message: t("auth.passwordPlaceholder"), trigger: "blur" },
    { min: 6, message: t("auth.passwordMinLength"), trigger: "blur" }
  ]
}));

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value.validate((errors: any) => {
    if (!errors) {
      emit("finish", formValue.value);
    }
  });
};
</script>

<template>
  <n-form ref="formRef" label-placement="left" size="large" :model="formValue" :rules="rules">
    <n-form-item path="email">
      <n-input v-model:value="formValue.email" :placeholder="$t('auth.emailPlaceholder')">
        <template #prefix>
          <SvgIcon icon="solar:user-broken" class="mr-3 text-lg" />
        </template>
      </n-input>
    </n-form-item>

    <n-form-item path="password">
      <n-input
        v-model:value="formValue.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('auth.passwordPlaceholder')"
      >
        <template #prefix>
          <SvgIcon icon="solar:lock-password-unlocked-broken" class="mr-3 text-lg" />
        </template>
      </n-input>
    </n-form-item>

    <n-form-item>
      <n-button
        type="primary"
        @click="handleSubmit"
        size="large"
        block
        :loading="loading"
        class="!mt-4"
      >
        {{ $t("auth.loginButton") }}
      </n-button>
    </n-form-item>
  </n-form>
</template>
