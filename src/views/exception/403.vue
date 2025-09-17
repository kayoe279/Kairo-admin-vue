<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/");
};
</script>

<template>
  <div class="flex h-screen w-full flex-col justify-center rounded px-0 py-12">
    <div class="text-center">
      <img src="~@/assets/icons/exception/403.svg" alt="403 错误" class="mx-auto w-[350px]" />
    </div>
    <div class="text-center">
      <h1 class="py-5 text-base text-gray-500">抱歉，你无权访问该页面</h1>
      <n-button type="info" @click="goHome">回到首页</n-button>
    </div>
  </div>
</template>
