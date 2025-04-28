<template>
  <div class="flex justify-between pt-4">
    <div class="flex flex-1 items-center justify-start">
      <slot name="footer-left"></slot>
    </div>
    <div class="flex flex-1 justify-end">
      <slot name="footer-right"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 无需额外逻辑
</script>

<style lang="less" scoped>
.table-footer {
  display: flex;
  justify-content: space-between;
  padding: 16px 0 0 0;

  &-left {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
  }

  &-right {
    display: flex;
    justify-content: flex-end;
    flex: 1;
  }
}
</style>
