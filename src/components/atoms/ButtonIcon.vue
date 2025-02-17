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
  /** Hide tooltip */
  hideTooltip?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  class: "",
  icon: "",
  tooltipContent: "",
  tooltipPlacement: "bottom",
  zIndex: 98,
  hideTooltip: false
});

defineSlots<{ default(): any }>();
</script>

<template>
  <button v-if="hideTooltip" :class="cn('text-xl', props.class)" v-bind="$attrs">
    <SvgIcon :icon="icon" />
  </button>
  <NTooltip v-else :placement="tooltipPlacement" :z-index="zIndex" :disabled="!tooltipContent">
    <template #trigger>
      <button :class="cn('text-xl', props.class)" v-bind="$attrs">
        <SvgIcon :icon="icon" v-if="icon" />
        <slot v-else />
      </button>
    </template>
    {{ tooltipContent }}
  </NTooltip>
</template>
