<script setup lang="ts">
import { NButton, NForm, NFormItem, NInput } from "naive-ui";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
}

type RegisterFormProps = {
  loading?: boolean;
  initialValues?: Partial<RegisterCredentials>;
};

withDefaults(defineProps<RegisterFormProps>(), {
  loading: false,
  initialValues: () => ({})
});

const emit = defineEmits<{
  finish: [values: RegisterCredentials];
}>();

const formRef = ref();
const formValue = ref<RegisterCredentials>({
  email: "",
  password: "",
  confirmPassword: "",
  fullName: ""
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
  ],
  confirmPassword: [
    { required: true, message: t("auth.confirmPasswordPlaceholder"), trigger: "blur" },
    {
      validator: (rule: any, value: string) => {
        if (value !== formValue.value.password) {
          return new Error(t("auth.passwordMismatch"));
        }
        return true;
      },
      trigger: ["blur", "change"]
    }
  ],
  fullName: [{ required: true, message: t("auth.fullNamePlaceholder"), trigger: "blur" }]
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
    <n-form-item path="fullName">
      <n-input v-model:value="formValue.fullName" :placeholder="$t('auth.fullNamePlaceholder')">
        <template #prefix>
          <SvgIcon icon="solar:user-id-broken" class="mr-3 text-lg" />
        </template>
      </n-input>
    </n-form-item>

    <n-form-item path="email">
      <n-input v-model:value="formValue.email" :placeholder="$t('auth.emailPlaceholder')">
        <template #prefix>
          <SvgIcon icon="solar:letter-broken" class="mr-3 text-lg" />
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

    <n-form-item path="confirmPassword">
      <n-input
        v-model:value="formValue.confirmPassword"
        type="password"
        show-password-on="click"
        :placeholder="$t('auth.confirmPasswordPlaceholder')"
      >
        <template #prefix>
          <SvgIcon icon="solar:lock-password-broken" class="mr-3 text-lg" />
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
        {{ $t("auth.registerButton") }}
      </n-button>
    </n-form-item>
  </n-form>
</template>
