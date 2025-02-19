<script lang="ts" setup>
import { appConfig, defaultLoginParams } from "@/lib/settings/app";
import { login } from "@/service/api/login";
import { useUserStore } from "@/store/modules/user";
import { LockClosedOutline, LogoFacebook, LogoGithub, PersonOutline } from "@vicons/ionicons5";
import { useRequest } from "alova/client";
import { useMessage } from "naive-ui";
import { reactive, ref } from "vue";

const formRef = ref();
const message = useMessage();
const autoLogin = ref(true);

const formValue = reactive({
  ...defaultLoginParams,
  isCaptcha: true
});

const rules = {
  username: { required: true, message: "请输入用户名", trigger: "blur" },
  password: { required: true, message: "请输入密码", trigger: "blur" }
};

const { loading, data, send } = useRequest(login, { immediate: false });

const userStore = useUserStore();

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value.validate(async (errors) => {
    if (!errors) {
      message.loading("登录中...");
      await send({
        username: formValue.username,
        password: formValue.password
      });

      const result = data.value;
      message.destroyAll();
      if (result.code === 200) {
        message.success("登录成功，即将进入系统");
        userStore.handleLoginInfo(result.data);
      } else {
        message.error("登录失败");
      }
    } else {
      message.error("请填写完整信息，并且进行验证码校验");
    }
  });
};
</script>

<template>
  <div class="view-account">
    <div class="view-account-header"></div>
    <div class="view-account-container">
      <div class="view-account-top">
        <div class="view-account-top-desc">{{ appConfig.loginDesc }}</div>
      </div>
      <div class="view-account-form">
        <n-form ref="formRef" label-placement="left" size="large" :model="formValue" :rules="rules">
          <n-form-item path="username">
            <n-input v-model:value="formValue.username" placeholder="请输入用户名">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <PersonOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="password">
            <n-input
              v-model:value="formValue.password"
              type="password"
              showPasswordOn="click"
              placeholder="请输入密码"
            >
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <LockClosedOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item class="default-color">
            <div class="flex justify-between">
              <div class="flex-initial">
                <n-checkbox v-model:checked="autoLogin">自动登录</n-checkbox>
              </div>
              <div class="order-last flex-initial">
                <a href="javascript:">忘记密码</a>
              </div>
            </div>
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="handleSubmit" size="large" :loading="loading" block>
              登录
            </n-button>
          </n-form-item>
          <n-form-item class="default-color">
            <div class="view-account-other flex">
              <div class="flex-initial">
                <span>其它登录方式</span>
              </div>
              <div class="mx-2 flex-initial">
                <a href="javascript:">
                  <n-icon size="24" color="#2d8cf0">
                    <LogoGithub />
                  </n-icon>
                </a>
              </div>
              <div class="mx-2 flex-initial">
                <a href="javascript:">
                  <n-icon size="24" color="#2d8cf0">
                    <LogoFacebook />
                  </n-icon>
                </a>
              </div>
              <div class="flex-initial" style="margin-left: auto">
                <a href="javascript:">注册账号</a>
              </div>
            </div>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.view-account {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;

  &-container {
    flex: 1;
    padding: 32px 12px;
    max-width: 384px;
    min-width: 320px;
    margin: 0 auto;
  }

  &-top {
    padding: 32px 0;
    text-align: center;

    &-desc {
      font-size: 14px;
      color: #808695;
    }
  }

  &-other {
    width: 100%;
  }

  .default-color {
    color: #515a6e;

    .ant-checkbox-wrapper {
      color: #515a6e;
    }
  }
}

@media (min-width: 768px) {
  .view-account {
    background-image: url("../../assets/images/login.svg");
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: 100%;
  }

  .page-account-container {
    padding: 32px 0 24px 0;
  }
}
</style>
