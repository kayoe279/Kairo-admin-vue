<template>
  <n-drawer :show="show" @update:show="$emit('update:show', $event)" :width="300" placement="right">
    <n-drawer-content title="列设置">
      <n-space vertical>
        <n-checkbox-group v-model:value="checkedKeys">
          <n-space vertical>
            <n-checkbox
              v-for="item in columns"
              :key="item.key"
              :value="item.key"
              :disabled="item.required"
            >
              {{ item.title }}
            </n-checkbox>
          </n-space>
        </n-checkbox-group>
      </n-space>
      <template #footer>
        <n-space>
          <n-button @click="handleReset">重置</n-button>
          <n-button type="primary" @click="handleConfirm">确定</n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
import type { BasicColumn } from "../types/table";
import { ref, watch } from "vue";

const props = defineProps<{
  show: boolean;
  columns: BasicColumn[];
  defaultCheckedKeys: string[];
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
  (e: "confirm", keys: string[]): void;
}>();

const checkedKeys = ref<string[]>(props.defaultCheckedKeys);

watch(
  () => props.show,
  (val) => {
    if (val) {
      checkedKeys.value = props.defaultCheckedKeys;
    }
  }
);

function handleReset() {
  checkedKeys.value = props.defaultCheckedKeys;
}

function handleConfirm() {
  emit("confirm", checkedKeys.value);
  emit("update:show", false);
}
</script>
