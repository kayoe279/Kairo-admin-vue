<script setup lang="ts">
import { useTableContext } from "@/components/molecules/Table";
import { useThemeStore } from "@/store/modules/theme";
import { cloneDeep } from "lodash-es";
import { computed, ref, toRaw, unref, watchEffect } from "vue";
import Draggable from "vuedraggable";

interface ColumnOption {
  title: string;
  key: string;
  fixed?: boolean | "left" | "right";
  draggable?: boolean;
}

interface DragEvent {
  draggedContext: {
    element: ColumnOption;
  };
}

const themeStore = useThemeStore();
const table = useTableContext();

const columnsList = ref<ColumnOption[]>([]);
const showSelection = ref(false);
const isAllChecked = ref(true);
const checkedColumnKeys = ref<string[]>([]);
const defaultCheckedKeys = ref<string[]>([]);

const isDarkTheme = computed(() => themeStore.isDark);

watchEffect(() => {
  const columns = table.getColumns();
  if (columns.length) {
    initializeColumns();
  }
});

const initializeColumns = () => {
  const columns = getCurrentColumns();
  const keyList = columns.map((item) => item.key);
  checkedColumnKeys.value = keyList;
  defaultCheckedKeys.value = keyList;
  const filteredColumns = columns.filter((item) => item.key !== "action" && item.title !== "操作");

  if (!columnsList.value.length) {
    columnsList.value = cloneDeep(filteredColumns);
  }
};

const handleColumnToggle = (checkList: string[]) => {
  if (showSelection.value) {
    checkList.unshift("selection");
  }
  updateTableColumns(checkList);
};

const updateTableColumns = (columns: string[] | any[]) => {
  table.setColumns(columns);
};

const getCurrentColumns = () => {
  const columns: ColumnOption[] = [];
  table.getColumns().forEach((item: any) => {
    columns.push({ ...item });
  });
  return columns;
};

const resetAllColumns = () => {
  checkedColumnKeys.value = [...defaultCheckedKeys.value];
  isAllChecked.value = true;
  const cacheColumns = (table as any).getCacheColumns();
  const resetColumns = cacheColumns.map((item: any) => ({
    ...item,
    fixed: undefined
  }));
  updateTableColumns(resetColumns);
  columnsList.value = resetColumns;
};

const handleCheckAll = (checked: boolean) => {
  const cacheColumnKeys = (table as any).getCacheColumns(true);
  if (checked) {
    updateTableColumns(cacheColumnKeys);
    checkedColumnKeys.value = cacheColumnKeys;
  } else {
    updateTableColumns([]);
    checkedColumnKeys.value = [];
  }
};

const handleDragEnd = () => {
  const newColumns = toRaw(unref(columnsList));
  columnsList.value = newColumns;
  updateTableColumns(newColumns);
};

const handleSelectionToggle = (checked: boolean) => {
  const cacheColumns = (table as any).getCacheColumns();
  if (checked) {
    cacheColumns.unshift({ type: "selection", key: "selection" });
    updateTableColumns(cacheColumns);
  } else {
    cacheColumns.splice(0, 1);
    updateTableColumns(cacheColumns);
  }
};

const canMoveDragItem = (event: DragEvent) => {
  if (event.draggedContext.element.draggable === false) return false;
  return true;
};

const handleColumnFixed = (item: ColumnOption, fixedType: "left" | "right") => {
  if (!checkedColumnKeys.value.includes(item.key)) return;

  const columns = getCurrentColumns();
  const isFixed = item.fixed === fixedType ? undefined : fixedType;
  const columnIndex = columns.findIndex((col) => col.key === item.key);

  if (columnIndex !== -1) {
    columns[columnIndex].fixed = isFixed;
  }

  (table as any).setCacheColumnsField(item.key, { fixed: isFixed });
  columnsList.value[columnIndex].fixed = isFixed;
  updateTableColumns(columns);
};

const getFixedIconColor = (
  columnFixed: boolean | "left" | "right" | undefined,
  fixedType: "left" | "right"
) => {
  return columnFixed === fixedType ? "#2080f0" : undefined;
};
</script>

<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <div class="ml-3 cursor-pointer text-base text-gray-600 hover:text-blue-500">
        <n-popover trigger="click" :width="230" placement="bottom-end" class="p-0">
          <template #trigger>
            <SvgIcon icon="ant-design:setting-outlined" class="text-lg" />
          </template>
          <template #header>
            <div class="py-1">
              <n-space>
                <n-checkbox v-model:checked="isAllChecked" @update:checked="handleCheckAll">
                  列展示
                </n-checkbox>
                <n-checkbox v-model:checked="showSelection" @update:checked="handleSelectionToggle">
                  勾选列
                </n-checkbox>
                <n-button text type="info" size="small" class="mt-1" @click="resetAllColumns">
                  重置
                </n-button>
              </n-space>
            </div>
          </template>
          <div>
            <n-checkbox-group v-model:value="checkedColumnKeys" @update:value="handleColumnToggle">
              <Draggable
                v-model="columnsList"
                animation="300"
                item-key="key"
                filter=".no-draggable"
                :move="canMoveDragItem"
                @end="handleDragEnd"
              >
                <template #item="{ element }">
                  <div
                    class="flex items-center px-4 py-2 transition-colors hover:bg-blue-50"
                    :class="{
                      'hover:bg-gray-800': isDarkTheme,
                      'no-draggable': element.draggable === false
                    }"
                  >
                    <span
                      class="mr-2 inline-flex cursor-move"
                      :class="{ 'invisible cursor-default': element.draggable === false }"
                    >
                      <SvgIcon icon="ant-design:drag-outlined" class="text-lg" />
                    </span>
                    <n-checkbox :value="element.key" :label="element.title" class="flex-1" />
                    <div class="ml-auto flex items-center justify-end">
                      <n-tooltip trigger="hover" placement="bottom">
                        <template #trigger>
                          <SvgIcon
                            icon="ant-design:vertical-right-outlined"
                            :style="{ color: getFixedIconColor(element.fixed, 'left') }"
                            class="cursor-pointer text-lg"
                            @click="handleColumnFixed(element, 'left')"
                          />
                        </template>
                        <span>固定到左侧</span>
                      </n-tooltip>
                      <n-divider vertical class="mx-2" />
                      <n-tooltip trigger="hover" placement="bottom">
                        <template #trigger>
                          <SvgIcon
                            icon="ant-design:vertical-left-outlined"
                            :style="{ color: getFixedIconColor(element.fixed, 'right') }"
                            class="cursor-pointer text-lg"
                            @click="handleColumnFixed(element, 'right')"
                          />
                        </template>
                        <span>固定到右侧</span>
                      </n-tooltip>
                    </div>
                  </div>
                </template>
              </Draggable>
            </n-checkbox-group>
          </div>
        </n-popover>
      </div>
    </template>
    <span>列设置</span>
  </n-tooltip>
</template>
