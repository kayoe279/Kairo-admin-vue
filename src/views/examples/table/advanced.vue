<script setup lang="ts">
import { ref } from "vue";

const loading = ref(false);

const handleLoading = (newVal: boolean) => {
  console.log("%c [ newVal ]-7", "font-size:13px; background:pink; color:#bf2c9f;", newVal);
  loading.value = newVal;
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <ListSearchForm :loading="loading" />
    <ListTable @update:loading="handleLoading" />
  </div>
</template>
