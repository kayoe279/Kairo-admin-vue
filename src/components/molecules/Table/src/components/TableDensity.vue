<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["update:modelValue"]);
const props = withDefaults(
  defineProps<{
    modelValue?: string;
  }>(),
  {
    modelValue: "medium"
  }
);

const { t } = useI18n();

const densityOptions = computed(() => [
  {
    type: "menu",
    label: t("table.size.small"),
    key: "small"
  },
  {
    type: "menu",
    label: t("table.size.medium"),
    key: "medium"
  },
  {
    type: "menu",
    label: t("table.size.large"),
    key: "large"
  }
]);

const tableSize = ref(props.modelValue);

const densitySelect = (key: string) => {
  tableSize.value = key;
  emit("update:modelValue", key);
};
</script>

<template>
  <button type="button" class="flex items-center text-[0px]">
    <n-dropdown
      @select="densitySelect"
      trigger="click"
      :options="densityOptions"
      v-model:value="tableSize"
    >
      <SvgIcon icon="solar:paragraph-spacing-broken" class="text-fg-base cursor-pointer text-lg" />
    </n-dropdown>
  </button>
</template>
