<script setup lang="ts">
import { usePermission } from "@/hooks/usePermission";
import { tryParseJson } from "@/lib";
import { useSignIn } from "@/service";
import { RoleType } from "@/service/types";
import { useUserStore } from "@/store";
import { useMessage } from "naive-ui";
import { ref } from "vue";

const userStore = useUserStore();
const message = useMessage();
const { hasPermission } = usePermission();
const role = userStore.userInfo?.user_metadata?.roles?.[0] || "";

const { isPending, mutateAsync } = useSignIn();

const roleList: RoleType[] = ["super", "admin", "user"];
const accounts = tryParseJson(import.meta.env.VITE_EXAMPLE_ACCOUNT, []);
const password = import.meta.env.VITE_EXAMPLE_PASSWORD;

const isDisabled = ref(accounts.length === 0 || !password);

const roleMap = {
  super: accounts[0],
  admin: accounts[1],
  user: accounts[2]
};

const toggleUserRole = async (targetRole: RoleType) => {
  if (targetRole === role) {
    message.warning("当前角色与目标角色相同");
    return;
  }
  const result = await mutateAsync({
    email: roleMap[targetRole],
    password: password
  });
  if (result.user) {
    userStore.updateUserInfo(result.user);
    message.success(`已切换到 ${targetRole} 角色`);
  }
};
</script>

<template>
  <div>
    <n-card v-if="isDisabled" title="权限示例">
      <n-alert title="请配置 VITE_EXAMPLE_ACCOUNT 和 VITE_EXAMPLE_PASSWORD" type="warning" />
    </n-card>
    <n-card v-else title="权限示例">
      <n-h1> 当前权限：{{ role }}</n-h1>
      <n-spin :show="isPending">
        <div class="flex flex-wrap gap-x-4">
          <n-button
            v-for="item in roleList"
            :key="item"
            secondary
            strong
            :type="role === item ? 'success' : 'default'"
            @click="toggleUserRole(item)"
          >
            {{ item }}
          </n-button>
        </div>
      </n-spin>
      <n-h2>v-permission 指令用法</n-h2>
      <div class="flex flex-wrap gap-x-4">
        <n-button v-permission="['super']" type="success"> 仅super可见 </n-button>
        <n-button v-permission="['admin']" type="info"> admin可见 </n-button>
        <n-button v-permission="['admin', 'user']" type="warning"> admin和user可见 </n-button>
        <n-button v-permission="['user']" type="error"> user可见 </n-button>
      </div>

      <n-h2>usePermission 函数用法</n-h2>
      <div class="flex flex-wrap gap-x-4">
        <n-button v-if="hasPermission(['super'])" dashed type="success"> 仅super可见 </n-button>
        <n-button v-if="hasPermission(['admin'])" dashed type="info"> admin可见 </n-button>
        <n-button v-if="hasPermission(['admin', 'user'])" dashed type="warning">
          admin和user可见
        </n-button>
        <n-button v-if="hasPermission(['user'])" dashed type="error"> user可见 </n-button>
      </div>
    </n-card>
  </div>
</template>
