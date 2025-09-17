<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent
} from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";

// 注册必要的组件
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
]);

export interface BaseChartProps {
  /** 图表配置选项 */
  option: EChartsOption;
  /** 图表样式 */
  style?: Record<string, any>;
  /** 图表类名 */
  className?: string;
  /** 是否显示加载动画 */
  showLoading?: boolean;
  /** 加载动画配置 */
  loadingOption?: any;
  /** 图表主题 */
  theme?: string;
  /** 自动调整大小 */
  autoResize?: boolean;
}

// 定义 props
const props = withDefaults(defineProps<BaseChartProps>(), {
  style: () => ({ height: "400px" }),
  className: "",
  showLoading: false,
  autoResize: true
});

// 定义 emits
const emit = defineEmits(["click", "mouseover", "mouseout"]);

// 事件处理函数
const handleClick = (params: any) => {
  emit("click", params);
};

const handleMouseover = (params: any) => {
  emit("mouseover", params);
};

const handleMouseout = (params: any) => {
  emit("mouseout", params);
};
</script>

<template>
  <VChart
    :option="option"
    :style="style"
    :class="className"
    :loading="showLoading"
    :loading-options="loadingOption"
    :theme="theme"
    :autoResize="autoResize"
    @click="handleClick"
    @mouseover="handleMouseover"
    @mouseout="handleMouseout"
  />
</template>
