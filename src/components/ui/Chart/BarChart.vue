<script setup lang="ts">
import {
  CHART_COLORS,
  DEFAULT_AXIS,
  DEFAULT_GRID,
  DEFAULT_LEGEND,
  DEFAULT_TITLE,
  DEFAULT_TOOLTIP,
  getFlatStyle,
  getGradientColor
} from "./chartConfig";
import type { EChartsOption } from "echarts";
import { computed } from "vue";

export interface BarChartData {
  name: string;
  value: number;
}

export interface BarChartProps {
  /** 图表标题 */
  title?: string;
  /** 数据 */
  data: BarChartData[];
  /** X轴标签 */
  xAxisData?: string[];
  /** 是否显示数值标签 */
  showLabel?: boolean;
  /** 是否使用渐变色 */
  useGradient?: boolean;
  /** 柱子宽度 */
  barWidth?: string | number;
  /** 是否水平显示 */
  horizontal?: boolean;
}

// 定义 props
const props = withDefaults(defineProps<BarChartProps>(), {
  showLabel: true,
  useGradient: true,
  barWidth: "60%",
  horizontal: false
});

// 构建图表配置
const chartOption = computed(() => {
  return {
    title: props.title
      ? {
          ...DEFAULT_TITLE,
          text: props.title
        }
      : undefined,

    tooltip: {
      ...DEFAULT_TOOLTIP,
      trigger: "axis",
      formatter: (params: any) => {
        // 处理数组格式的参数（axis触发器）
        if (Array.isArray(params) && params.length > 0) {
          const param = params[0];
          const { name, value, seriesName } = param;
          return `
            <div style="padding: 8px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${name}</div>
              <div style="color: ${CHART_COLORS.primary[0]};">
                ${seriesName || "数值"}: <strong>${value}</strong>
              </div>
            </div>
          `;
        }
        // 处理单个对象格式的参数（item触发器）
        const { name, value, seriesName } = params;
        return `
          <div style="padding: 8px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${name}</div>
            <div style="color: ${CHART_COLORS.primary[0]};">
              ${seriesName || "数值"}: <strong>${value}</strong>
            </div>
          </div>
        `;
      }
    },

    legend: props.data.length > 1 ? DEFAULT_LEGEND : undefined,

    grid: DEFAULT_GRID,

    // 根据是否水平显示配置坐标轴
    ...(props.horizontal
      ? {
          xAxis: {
            ...DEFAULT_AXIS,
            type: "value",
            splitLine: {
              ...DEFAULT_AXIS.splitLine,
              show: true
            }
          },
          yAxis: {
            ...DEFAULT_AXIS,
            type: "category",
            data: props.xAxisData || props.data.map((item) => item.name),
            splitLine: {
              show: false
            }
          }
        }
      : {
          xAxis: {
            ...DEFAULT_AXIS,
            type: "category",
            data: props.xAxisData || props.data.map((item) => item.name),
            splitLine: {
              show: false
            }
          },
          yAxis: {
            ...DEFAULT_AXIS,
            type: "value",
            splitLine: {
              ...DEFAULT_AXIS.splitLine,
              show: true
            }
          }
        }),

    series: [
      {
        name: "数据",
        type: "bar" as const,
        data: props.data.map((item) => item.value),
        barWidth: props.barWidth,

        // 扁平化样式配置
        ...getFlatStyle(),

        // 颜色配置
        itemStyle: {
          ...getFlatStyle().itemStyle,
          color: props.useGradient ? getGradientColor(0) : CHART_COLORS.primary[0]
        },

        // 数值标签配置
        label: props.showLabel
          ? {
              show: true,
              position: props.horizontal ? "right" : "top",
              color: CHART_COLORS.text,
              fontSize: 11,
              fontWeight: 500,
              formatter: "{c}"
            }
          : undefined,

        // 动画配置
        animationDuration: 1000,
        animationEasing: "cubicOut"
      }
    ]
  } as EChartsOption;
});
</script>

<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>
