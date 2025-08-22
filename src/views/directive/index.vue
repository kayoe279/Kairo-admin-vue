<script setup lang="ts">
import { useMessage } from "naive-ui";
import { ref } from "vue";

defineOptions({
  name: "DirectiveDemo"
});

const copyText = ref<string>("");
const message = useMessage();

// 复制按钮点击处理函数
const handleCopyClick = (): void => {
  if (copyText.value) {
    message.success(`复制成功: ${copyText.value}`);
  } else {
    message.warning("请先输入要复制的内容");
  }
};

// 防抖测试函数
const handleDebounceTest = (): void => {
  message.success("防抖测试成功");
  console.log("防抖测试，当前输入内容:", copyText.value);
};

// 节流测试函数
const handleThrottleTest = (): void => {
  message.success("节流测试成功");
  console.log("节流测试，当前输入内容:", copyText.value);
};
</script>

<template>
  <div>
    <n-card title="复制指令" class="mb-4">
      <n-space>
        <n-input placeholder="输入内容试试" v-model:value="copyText" class="w-80" />
        <n-button v-copy="copyText" type="primary" @click="handleCopyClick"> 复 制 </n-button>
      </n-space>
    </n-card>

    <n-card title="防抖指令" class="mb-4">
      <n-button type="primary" v-debounce="handleDebounceTest"> 防抖测试 </n-button>
    </n-card>

    <n-card title="节流指令" class="mb-4">
      <n-button type="primary" v-throttle="handleThrottleTest"> 节流测试 </n-button>
    </n-card>

    <n-card title="拖拽指令" class="mb-4">
      <p class="mb-4 text-gray-600">鼠标放到矩形上面拖拽试试</p>
    </n-card>
    <div
      class="absolute z-50 mx-5 my-5 h-25 w-25 cursor-move rounded-lg bg-blue-500 transition-colors duration-200 hover:bg-blue-600"
      v-draggable
    />
  </div>
</template>
