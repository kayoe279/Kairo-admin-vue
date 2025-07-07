<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, unref } from "vue";
import { useRoute } from "vue-router";

const currentRoute = useRoute();
const isLoading = ref(false);
const iframeRef = ref<HTMLIFrameElement>();

const iframeUrl = computed(() => {
  return (currentRoute.meta?.href as string) || "";
});

const handleIframeLoad = () => {
  isLoading.value = false;
};

const initIframeEvents = () => {
  nextTick(() => {
    const iframe = unref(iframeRef);
    if (!iframe) return;

    iframe.onload = handleIframeLoad;
  });
};

onMounted(() => {
  isLoading.value = true;
  initIframeEvents();
});
</script>

<template>
  <n-spin :show="isLoading">
    <div class="h-screen w-full">
      <iframe
        :src="iframeUrl"
        class="box-border h-full w-full overflow-hidden border-0"
        ref="iframeRef"
      />
    </div>
  </n-spin>
</template>
