<script setup lang="ts">
import { CellComponent } from "./CellComponent";
import { createPlaceholderMessage } from "./helper";
import type { EditRecordRow } from "./index";
import SvgIcon from "@/components/atoms/SvgIcon.vue";
import { useTableContext } from "@/components/molecules/Table";
import type { BasicColumn } from "@/components/molecules/Table";
import { EventEnum } from "@/components/molecules/Table/src/componentMap";
import { isArray, isBoolean, isFunction, isNumber, isString } from "@/lib/utils/is";
import { format, parseISO } from "date-fns";
import { omit, set } from "lodash-es";
import { computed, nextTick, ref, toRaw, unref, watchEffect } from "vue";

interface Props {
  value?: string | number | boolean | Recordable;
  record?: EditRecordRow;
  column: BasicColumn;
  index?: number;
}

const props = withDefaults(defineProps<Props>(), {
  value: "",
  column: () => ({}) as BasicColumn
});

const table = useTableContext();

const isEditing = ref(false);
const cellRef = ref();
const isRuleVisible = ref(false);
const ruleMessage = ref("");
const selectOptions = ref<LabelValueOptions>([]);
const currentValue = ref<any>(props.value);
const defaultValue = ref<any>(props.value);

const editComponent = computed(() => props.column?.editComponent || "NInput");
const editRule = computed(() => props.column?.editRule);

const shouldShowRule = computed(() => {
  return unref(ruleMessage) && unref(isRuleVisible);
});

const isCheckboxComponent = computed(() => {
  const component = unref(editComponent);
  return ["NCheckbox", "NRadio"].includes(component);
});

const componentProps = computed(() => {
  const compProps = props.column?.editComponentProps ?? {};
  const editComponentType = props.column?.editComponent ?? null;
  const component = unref(editComponent);
  const apiSelectProps: Recordable = {};

  const isCheckValue = unref(isCheckboxComponent);
  let valueField = isCheckValue ? "checked" : "value";
  const val = unref(currentValue);
  let value = isCheckValue ? (isNumber(val) && isBoolean(val) ? val : !!val) : val;

  if (component === "NDatePicker") {
    if (isString(value)) {
      if (compProps.valueFormat) {
        valueField = "formatted-value";
      } else {
        value = parseISO(value as any).getTime();
      }
    } else if (isArray(value)) {
      if (compProps.valueFormat) {
        valueField = "formatted-value";
      } else {
        value = value.map((item) => parseISO(item).getTime());
      }
    }
  }

  const onEvent: any = editComponentType ? EventEnum[editComponentType] : undefined;

  return {
    placeholder: createPlaceholderMessage(unref(editComponent)),
    ...apiSelectProps,
    ...omit(compProps, "onChange"),
    [onEvent]: handleValueChange,
    [valueField]: value
  };
});

const displayValue = computed(() => {
  const { editComponentProps, editValueMap } = props.column;
  const value = unref(currentValue);

  if (editValueMap && isFunction(editValueMap)) {
    return editValueMap(value);
  }

  const component = unref(editComponent);
  if (!component.includes("NSelect")) {
    return value;
  }

  const options: LabelValueOptions = editComponentProps?.options ?? (unref(selectOptions) || []);
  const option = options.find((item) => `${item.value}` === `${value}`);

  return option?.label ?? value;
});

const cellAlignClass = computed(() => {
  const { align = "center" } = props.column;
  return `text-${align}`;
});

const isRowEditable = computed(() => {
  const { editable } = props.record || {};
  return !!editable;
});

watchEffect(() => {
  defaultValue.value = props.value;
});

watchEffect(() => {
  const { editable } = props.column;
  if (isBoolean(editable) || isBoolean(unref(isRowEditable))) {
    isEditing.value = !!editable || unref(isRowEditable);
  }
});

const startEditing = () => {
  if (unref(isRowEditable) || unref(props.column?.editRow)) return;
  ruleMessage.value = "";
  isEditing.value = true;
  nextTick(() => {
    const el = unref(cellRef);
    el?.focus?.();
  });
};

const handleValueChange = async (e: any) => {
  const component = unref(editComponent);
  const compProps = props.column?.editComponentProps ?? {};

  if (!e) {
    currentValue.value = e;
  } else if (e?.target && Reflect.has(e.target, "value")) {
    currentValue.value = e.target.value;
  } else if (component === "NCheckbox") {
    currentValue.value = e.target.checked;
  } else if (isString(e) || isBoolean(e) || isNumber(e)) {
    currentValue.value = e;
  }

  if (component === "NDatePicker") {
    if (isNumber(currentValue.value)) {
      if (compProps.valueFormat) {
        currentValue.value = format(currentValue.value, compProps.valueFormat);
      }
    } else if (isArray(currentValue.value)) {
      if (compProps.valueFormat) {
        currentValue.value = currentValue.value.map((item) => {
          return format(item, compProps.valueFormat);
        });
      }
    }
  }

  const onChange = props.column?.editComponentProps?.onChange;
  if (onChange && isFunction(onChange)) onChange(e);

  table.emit?.("edit-change", {
    column: props.column,
    value: unref(currentValue),
    record: toRaw(props.record)
  });
  await validateRule();
};

const validateRule = async () => {
  const { column, record } = props;
  const { editRule } = column;
  const currentVal = unref(currentValue);

  if (editRule) {
    if (isBoolean(editRule) && !currentVal && !isNumber(currentVal)) {
      isRuleVisible.value = true;
      const component = unref(editComponent);
      ruleMessage.value = createPlaceholderMessage(component);
      return false;
    }
    if (isFunction(editRule)) {
      const res = await editRule(currentVal, record as Recordable);
      if (!!res) {
        ruleMessage.value = res;
        isRuleVisible.value = true;
        return false;
      } else {
        ruleMessage.value = "";
        return true;
      }
    }
  }
  ruleMessage.value = "";
  return true;
};

const submitEdit = async (needEmit = true, valid = true) => {
  if (valid) {
    const isValid = await validateRule();
    if (!isValid) return false;
  }

  const { column, index, record } = props;
  if (!record) return false;
  const { key } = column;
  const value = unref(currentValue);
  if (!key) return;

  const dataKey = key as string;
  set(record, dataKey, value);
  needEmit && table.emit?.("edit-end", { record, index, key, value });
  isEditing.value = false;
  return true;
};

const handleEnterKey = async () => {
  if (props.column?.editRow) {
    return;
  }
  await submitEdit();
};

const cancelEdit = () => {
  isEditing.value = false;
  currentValue.value = defaultValue.value;
  const { column, index, record } = props;
  const { key } = column;
  isRuleVisible.value = false;
  ruleMessage.value = "";
  table.emit?.("edit-cancel", {
    record,
    index,
    key: key,
    value: unref(currentValue)
  });
};

const handleClickOutside = () => {
  if (props.column?.editable || unref(isRowEditable)) {
    return;
  }
  const component = unref(editComponent);

  if (component.includes("NInput")) {
    cancelEdit();
  }
};

const handleSelectOptionsChange = (options: LabelValueOptions) => {
  selectOptions.value = options;
};

const initializeCallbacks = (cbType: "submitCbs" | "validCbs" | "cancelCbs", handler: Fn) => {
  if (props.record) {
    const record = toRaw(props.record);
    isArray(record[cbType]) ? record[cbType]?.push(handler) : (record[cbType] = [handler]);
  }
};

if (props.record) {
  const record = toRaw(props.record);
  initializeCallbacks("submitCbs", submitEdit);
  initializeCallbacks("validCbs", validateRule);
  initializeCallbacks("cancelCbs", cancelEdit);

  if (props.column.key) {
    if (!record.editValueRefs) record.editValueRefs = {};
    record.editValueRefs[props.column.key] = currentValue;
  }

  record.onCancelEdit = () => {
    isArray(record?.cancelCbs) && record?.cancelCbs.forEach((fn) => fn());
  };

  record.onSubmitEdit = async () => {
    if (isArray(record?.submitCbs)) {
      const validFns = (record?.validCbs || []).map((fn) => fn());
      const res = await Promise.all(validFns);
      const isValid = res.every((item) => !!item);

      if (!isValid) return false;

      const submitFns = record?.submitCbs || [];
      submitFns.forEach((fn) => fn(false, false));
      table.emit?.("edit-row-end");
      return true;
    }
    return false;
  };
}
</script>

<template>
  <div>
    <div v-if="isEditing" class="flex" v-click-outside="handleClickOutside">
      <div class="flex-1">
        <CellComponent
          v-bind="componentProps"
          :component="editComponent"
          :popoverVisible="shouldShowRule"
          :ruleMessage="ruleMessage"
          :rule="editRule"
          :class="cellAlignClass"
          ref="cellRef"
          @options-change="handleSelectOptionsChange"
          @press-enter="handleEnterKey"
        />
      </div>
      <div v-if="!isRowEditable" class="flex items-center justify-center">
        <SvgIcon
          icon="ant-design:check-outlined"
          class="mx-2 cursor-pointer text-base hover:text-green-500"
          title="保存"
          @click="submitEdit"
        />
        <SvgIcon
          icon="ant-design:close-outlined"
          class="mx-2 cursor-pointer text-base hover:text-red-500"
          title="取消"
          @click="cancelEdit"
        />
      </div>
    </div>
    <div
      v-else
      class="relative flex cursor-pointer items-center overflow-hidden break-words text-ellipsis whitespace-nowrap"
      @click="startEditing"
    >
      {{ displayValue }}
      <SvgIcon
        v-if="!column.editRow"
        icon="ant-design:form-outlined"
        class="ml-1 w-5 text-sm opacity-0 transition-opacity group-hover:opacity-100"
      />
    </div>
  </div>
</template>

<style scoped>
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
