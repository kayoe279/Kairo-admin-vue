<script setup lang="ts">
import { useResendConfirmation, useVerifyOtp } from "@/service";
import { NButton, NForm, NFormItem, NInput, NText, useMessage } from "naive-ui";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

type EmailVerificationProps = {
  email: string;
};

const props = withDefaults(defineProps<EmailVerificationProps>(), {
  email: ""
});

const emit = defineEmits<{
  verifySuccess: [];
  back: [];
  resendCode: [];
}>();

const formRef = ref();
const verificationCode = ref("");

const message = useMessage();
const { isPending, mutateAsync: verifyOtp } = useVerifyOtp();
const { isPending: isResendPending, mutateAsync: resendConfirmation } = useResendConfirmation();

const rules = computed(() => ({
  code: [
    { required: true, message: t("auth.verificationCodePlaceholder"), trigger: "blur" },
    { len: 6, message: t("auth.verificationCodeLength"), trigger: "blur" }
  ]
}));

const handleVerify = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value.validate(async (errors: any) => {
    if (!errors) {
      const result = await verifyOtp({
        email: props.email,
        token: verificationCode.value,
        type: "signup"
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
      emit("verifySuccess");
    }
  });
};

const resendVerification = async () => {
  try {
    const result = await resendConfirmation({ email: props.email, type: "signup" });

    if (result.error) {
      throw new Error(result.error.message);
    }
    emit("resendCode");
    message.success(t("auth.resendCodeSuccess"));
  } catch (error) {
    message.error(`${t("auth.resendCodeFailed")}: ${error}`);
  }
};

const handleBack = () => {
  emit("back");
};
</script>

<template>
  <div class="space-y-4">
    <div class="text-center">
      <h2 class="mb-2 text-xl font-semibold">{{ $t("auth.verifyEmail") }}</h2>
      <NText class="text-sm">
        {{ $t("auth.verificationSent") }} <strong>{{ email }}</strong>
      </NText>
    </div>

    <NForm
      ref="formRef"
      label-placement="left"
      size="large"
      :model="{ code: verificationCode }"
      :rules="rules"
    >
      <NFormItem path="code">
        <NInput
          v-model:value="verificationCode"
          :placeholder="$t('auth.verificationCodePlaceholder')"
          maxlength="6"
          clearable
        >
          <template #prefix>
            <SvgIcon icon="solar:shield-check-broken" class="mr-3 text-lg" />
          </template>
        </NInput>
      </NFormItem>

      <NFormItem>
        <NButton type="primary" @click="handleVerify" size="large" block :loading="isPending">
          {{ $t("auth.verifyButton") }}
        </NButton>
      </NFormItem>
    </NForm>

    <div class="space-y-3 text-center">
      <div class="flex items-center justify-center">
        <NText class="text-sm">
          {{ $t("auth.notReceiveCode") }}
        </NText>
        <NButton text type="primary" @click="resendVerification" :loading="isResendPending">
          {{ $t("auth.resendCode") }}
        </NButton>
      </div>

      <NButton text @click="handleBack" class="!p-0">
        {{ $t("auth.backToRegister") }}
      </NButton>
    </div>
  </div>
</template>
