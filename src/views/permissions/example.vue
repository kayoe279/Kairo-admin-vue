<script setup lang="ts">
import { usePermission } from "@/hooks/usePermission";
import { defaultLoginParams } from "@/lib/settings/app";
import { login } from "@/service/api/login";
import { useUserStore } from "@/store";
import { useRequest } from "alova/client";

const userStore = useUserStore();
const { hasPermission } = usePermission();
const role = userStore.userInfo?.roles?.[0] || "";

const { loading, send } = useRequest(login, {
  immediate: false
});

const roleList: Entity.RoleType[] = ["super", "admin", "user"];

const toggleUserRole = async (role: Entity.RoleType) => {
  const result = await send({ ...defaultLoginParams, username: role });
  if (result.isSuccess) {
    userStore.handleLoginInfo(result.data);
  }
};
</script>

<template>
  <n-card title="权限示例">
    <n-h1> 当前权限：{{ role }}</n-h1>
    <n-spin :show="loading">
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
</template>
