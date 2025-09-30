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
</script>

<template>
  <div class="space-y-4">
    <div class="text-center">
      <h2 class="mb-2 text-lg font-medium">{{ $t("auth.verifyEmailTitle") }}</h2>
      <n-text class="text-foreground-subtle !mx-auto block !w-[90%] text-sm">
        {{ $t("auth.verifyEmailDesc", { email }) }}
      </n-text>
    </div>

    <n-form
      ref="formRef"
      label-placement="left"
      size="large"
      :model="{ code: verificationCode }"
      :rules="rules"
    >
      <n-form-item path="code">
        <n-input
          v-model:value="verificationCode"
          :placeholder="$t('auth.verificationCodePlaceholder')"
          maxlength="6"
          clearable
        >
          <template #prefix>
            <SvgIcon icon="solar:shield-check-broken" class="mr-3 text-lg" />
          </template>
        </n-input>
      </n-form-item>

      <n-form-item>
        <n-button type="primary" @click="handleVerify" size="large" block :loading="isPending">
          {{ $t("auth.verifyButton") }}
        </n-button>
      </n-form-item>
    </n-form>

    <div class="space-y-3 text-center">
      <div class="flex items-center justify-center">
        <n-text class="text-sm">
          {{ $t("auth.noCodeReceived") }}
        </n-text>
        <n-button text type="primary" @click="resendVerification" :loading="isResendPending">
          {{ $t("auth.resendCode") }}
        </n-button>
      </div>
    </div>
  </div>
</template>
