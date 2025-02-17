<script setup lang="ts">
import { cn } from "@/lib/utils";
import type { PopoverPlacement } from "naive-ui";

defineOptions({
  name: "ButtonIcon",
  inheritAttrs: false
});

interface Props {
  /** Button class */
  class?: string;
  /** Iconify icon name */
  icon?: string;
  /** Tooltip content */
  tooltipContent?: string;
  /** Tooltip placement */
  tooltipPlacement?: PopoverPlacement;
  zIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  icon: "",
  tooltipContent: "",
  tooltipPlacement: "bottom",
  zIndex: 98
});
</script>

<template>
  <NTooltip :placement="tooltipPlacement" :z-index="zIndex" :disabled="!tooltipContent">
    <template #trigger>
      <NButton quaternary :class="cn('text-icon h-9', props.class)" v-bind="$attrs">
        <div class="flex-center gap-2">
          <SvgIcon :icon="icon" />
        </div>
      </NButton>
    </template>
    {{ tooltipContent }}
  </NTooltip>
</template>
