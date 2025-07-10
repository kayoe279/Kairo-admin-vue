<script setup lang="ts">
import type { ActionItem } from "@/components/molecules/Table";
import { usePermission } from "@/hooks/web/usePermission";
import { isBoolean, isFunction } from "@/lib/utils/is";
import type { DropdownOption } from "naive-ui";
import { computed, toRaw, useSlots } from "vue";

interface Props {
  actions: ActionItem[];
  dropDownActions?: ActionItem[];
  style?: "button" | "text";
  select?: (key: string, option: DropdownOption) => void;
}

const props = withDefaults(defineProps<Props>(), {
  actions: () => [],
  dropDownActions: () => [],
  style: "button",
  select: () => {}
});

const slots = useSlots();
const { hasPermission } = usePermission();

const buttonType = computed(() => {
  return props.style === "button" ? "default" : "primary";
});

const isTextStyle = computed(() => {
  return props.style === "text";
});

const moreButtonProps = computed(() => {
  return {
    text: isTextStyle.value,
    type: buttonType.value as any,
    size: "small" as const
  };
});

const shouldShowAction = (action: ActionItem): boolean => {
  const { ifShow } = action;

  if (isBoolean(ifShow)) {
    return ifShow;
  }

  if (isFunction(ifShow)) {
    return ifShow(action);
  }

  return true;
};

const filteredActions = computed(() => {
  return (toRaw(props.actions) || [])
    .filter((action) => {
      return hasPermission(action.auth as string[]) && shouldShowAction(action);
    })
    .map((action) => {
      const { popConfirm, type, ...restAction } = action;

      return {
        ...restAction,
        size: "small" as const,
        text: isTextStyle.value,
        type: type as any,
        ...(popConfirm && {
          onConfirm: popConfirm.confirm,
          onCancel: popConfirm.cancel
        })
      };
    });
});

const dropdownOptions = computed(() => {
  return (toRaw(props.dropDownActions) || [])
    .filter((action) => {
      return hasPermission(action.auth as string[]) && shouldShowAction(action);
    })
    .map((action) => {
      const { popConfirm, label, onClick, ...restAction } = action;

      return {
        key: action.label || Math.random().toString(),
        label: label || "",
        ...restAction,
        ...(popConfirm && {
          onConfirm: popConfirm.confirm,
          onCancel: popConfirm.cancel
        }),
        onClick: onClick
      } as DropdownOption;
    });
});

const hasDropdownActions = computed(() => {
  return props.dropDownActions && dropdownOptions.value.length > 0;
});

const handleSelect = (key: string, option: DropdownOption) => {
  props.select(key, option);
};
</script>

<template>
  <div class="flex items-center justify-center">
    <template v-for="(action, index) in filteredActions" :key="`${index}-${action.label}`">
      <n-button v-bind="action" class="mx-1">
        {{ action.label }}
        <template v-if="action.icon" #icon>
          <n-icon :component="action.icon" />
        </template>
      </n-button>
    </template>

    <n-dropdown
      v-if="hasDropdownActions"
      trigger="hover"
      :options="dropdownOptions"
      @select="handleSelect"
    >
      <slot name="more" />
      <n-button v-if="!slots.more" v-bind="moreButtonProps" class="mx-1" icon-placement="right">
        <div class="flex items-center">
          <span>更多</span>
          <SvgIcon icon="ant-design:down-outlined" class="ml-1 text-sm" />
        </div>
      </n-button>
    </n-dropdown>
  </div>
</template>
