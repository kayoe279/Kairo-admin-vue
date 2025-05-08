<script setup lang="ts">
import { useTableContext } from "../../hooks/useTableContext";
// import { useThemeSettingStore } from "@/store/modules/themeSetting";
import {
  DragOutlined,
  SettingOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined
} from "@vicons/antd";
import { cloneDeep } from "lodash-es";
import { computed, reactive, ref, toRaw, unref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import Draggable from "vuedraggable";

interface Options {
  title: string;
  key: string;
  fixed?: boolean | "left" | "right";
}

const { t } = useI18n();
// const themeStore = useThemeSettingStore();
const table = useTableContext();
const columnsList = ref<Options[]>([]);
const cacheColumnsList = ref<Options[]>([]);

const state = reactive({
  selection: false,
  checkAll: true,
  checkList: [],
  defaultCheckList: []
});

const getSelection = computed(() => state.selection);

watchEffect(() => {
  const columns = table.getColumns();
  if (columns.length) {
    init();
  }
});

// 初始化
const init = () => {
  const columns: any[] = getColumns();
  const checkList: any = columns.map((item) => item.key);
  state.checkList = checkList;
  state.defaultCheckList = checkList;
  const newColumns = columns.filter((item) => item.key != "action" && item.title != "操作");
  if (!columnsList.value.length) {
    columnsList.value = cloneDeep(newColumns);
    cacheColumnsList.value = cloneDeep(newColumns);
  }
};

// 切换
const onChange = (checkList) => {
  if (state.selection) {
    checkList.unshift("selection");
  }
  setColumns(checkList);
};

// 设置
const setColumns = (columns) => {
  table.setColumns(columns);
};

// 获取
const getColumns = () => {
  const newRet: any[] = [];
  table.getColumns().forEach((item) => {
    newRet.push({ ...item });
  });
  return newRet;
};

// 重置
const resetColumns = () => {
  state.checkList = [...state.defaultCheckList];
  state.checkAll = true;
  const cacheColumnsKeys: any[] = table.getCacheColumns();
  const newColumns = cacheColumnsKeys.map((item) => ({
    ...item,
    fixed: undefined
  }));
  setColumns(newColumns);
  columnsList.value = newColumns;
};

// 全选
const onCheckAll = (e) => {
  const checkList = table.getCacheColumns(true);
  if (e) {
    setColumns(checkList);
    state.checkList = checkList;
  } else {
    setColumns([]);
    state.checkList = [];
  }
};

// 拖拽排序
const draggableEnd = () => {
  const newColumns = toRaw(unref(columnsList));
  columnsList.value = newColumns;
  setColumns(newColumns);
};

// 勾选列
const onSelection = (e) => {
  const checkList = table.getCacheColumns();
  if (e) {
    checkList.unshift({ type: "selection", key: "selection" });
    setColumns(checkList);
  } else {
    checkList.splice(0, 1);
    setColumns(checkList);
  }
};

const onMove = (e) => {
  if (e.draggedContext.element.draggable === false) return false;
  return true;
};

// 固定
const fixedColumn = (item, fixed) => {
  if (!state.checkList.includes(item.key as never)) return;
  const columns = getColumns();
  const isFixed = item.fixed === fixed ? undefined : fixed;
  const index = columns.findIndex((res) => res.key === item.key);
  if (index !== -1) {
    columns[index].fixed = isFixed;
  }
  table.setCacheColumnsField(item.key, { fixed: isFixed });
  columnsList.value[index].fixed = isFixed;
  setColumns(columns);
};
</script>

<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <div class="text-text hover:text-primary ml-3 cursor-pointer text-base">
        <n-popover trigger="click" :width="230" placement="bottom-end" class="!p-0">
          <template #trigger>
            <n-icon size="18">
              <SettingOutlined />
            </n-icon>
          </template>
          <template #header>
            <div class="py-1">
              <n-space>
                <n-checkbox v-model:checked="state.checkAll" @update:checked="onCheckAll">
                  {{ t("table.columnSetting") }}
                </n-checkbox>
                <n-checkbox v-model:checked="state.selection" @update:checked="onSelection">
                  {{ t("table.selection") }}
                </n-checkbox>
                <n-button text type="info" size="small" class="mt-1" @click="resetColumns">
                  {{ t("common.reset") }}
                </n-button>
              </n-space>
            </div>
          </template>
          <div>
            <n-checkbox-group v-model:value="state.checkList" @update:value="onChange">
              <Draggable
                v-model="columnsList"
                animation="300"
                item-key="key"
                filter=".no-draggable"
                :move="onMove"
                @end="draggableEnd"
              >
                <template #item="{ element }">
                  <div
                    class="flex items-center px-3.5 py-2.5 hover:bg-blue-50 dark:hover:bg-white/8"
                    :class="{
                      'no-draggable': element.draggable === false
                    }"
                  >
                    <span
                      class="mr-2 inline-flex cursor-move"
                      :class="{ 'invisible cursor-default': element.draggable === false }"
                    >
                      <n-icon size="18">
                        <DragOutlined />
                      </n-icon>
                    </span>
                    <n-checkbox
                      :value="element.key"
                      :label="element.title"
                      class="hover:text-primary flex-1"
                    />
                    <div class="ml-auto flex items-center justify-end">
                      <n-tooltip trigger="hover" placement="bottom">
                        <template #trigger>
                          <n-icon
                            size="18"
                            :color="element.fixed === 'left' ? '#2080f0' : undefined"
                            class="cursor-pointer"
                            @click="fixedColumn(element, 'left')"
                          >
                            <VerticalRightOutlined />
                          </n-icon>
                        </template>
                        <span>{{ t("table.fixLeft") }}</span>
                      </n-tooltip>
                      <n-divider vertical />
                      <n-tooltip trigger="hover" placement="bottom">
                        <template #trigger>
                          <n-icon
                            size="18"
                            :color="element.fixed === 'right' ? '#2080f0' : undefined"
                            class="cursor-pointer"
                            @click="fixedColumn(element, 'right')"
                          >
                            <VerticalLeftOutlined />
                          </n-icon>
                        </template>
                        <span>{{ t("table.fixRight") }}</span>
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
    <span>{{ t("table.columnSetting") }}</span>
  </n-tooltip>
</template>
