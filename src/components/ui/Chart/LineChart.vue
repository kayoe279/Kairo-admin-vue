<script setup lang="ts">
import BaseChart from "./BaseChart.vue";
import {
  CHART_COLORS,
  DEFAULT_AXIS,
  DEFAULT_GRID,
  DEFAULT_LEGEND,
  DEFAULT_TITLE,
  DEFAULT_TOOLTIP,
  getGradientColor
} from "./chartConfig";
import type { EChartsOption } from "echarts";
import { computed } from "vue";

export interface LineChartData {
  name: string;
  data: number[];
}

export interface LineChartProps {
  /** 图表标题 */
  title?: string;
  /** 数据系列 */
  data: LineChartData[];
  /** X轴标签 */
  xAxisData: string[];
  /** 是否显示区域填充 */
  showArea?: boolean;
  /** 是否平滑曲线 */
  smooth?: boolean;
  /** 是否显示数据点 */
  showSymbol?: boolean;
  /** 线条宽度 */
  lineWidth?: number;
}

// 定义 props
const props = withDefaults(defineProps<LineChartProps>(), {
  showArea: false,
  smooth: true,
  showSymbol: true,
  lineWidth: 3
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
      axisPointer: {
        type: "cross",
        lineStyle: {
          color: CHART_COLORS.border,
          type: "dashed"
        }
      },
      formatter: (params: any[]) => {
        const axisValue = params[0]?.axisValue;
        let content = `<div style="padding: 8px;">`;
        content += `<div style="font-weight: 600; margin-bottom: 8px;">${axisValue}</div>`;

        params.forEach((param) => {
          const { seriesName, value, color } = param;
          content += `
            <div style="display: flex; align-items: center; margin-bottom: 4px;">
              <div style="width: 8px; height: 8px; background: ${color}; border-radius: 50%; margin-right: 8px;"></div>
              <span style="color: ${CHART_COLORS.textSecondary};">${seriesName}:</span>
              <strong style="margin-left: 8px; color: ${CHART_COLORS.text};">${value}</strong>
            </div>
          `;
        });

        content += `</div>`;
        return content;
      }
    },

    legend:
      props.data.length > 1
        ? {
            ...DEFAULT_LEGEND,
            data: props.data.map((item) => item.name)
          }
        : undefined,

    grid: DEFAULT_GRID,

    xAxis: {
      ...DEFAULT_AXIS,
      type: "category",
      data: props.xAxisData,
      boundaryGap: false, // 折线图不需要边界间隙
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
    },

    series: props.data.map((series, index) => ({
      name: series.name,
      type: "line" as const,
      data: series.data,
      smooth: props.smooth,
      showSymbol: props.showSymbol,
      symbolSize: 6,

      // 线条样式
      lineStyle: {
        width: props.lineWidth,
        color: CHART_COLORS.primary[index % CHART_COLORS.primary.length]
      },

      // 数据点样式
      itemStyle: {
        color: CHART_COLORS.primary[index % CHART_COLORS.primary.length],
        borderWidth: 2,
        borderColor: "#ffffff"
      },

      // 区域填充配置
      areaStyle: props.showArea
        ? {
            color: getGradientColor(index),
            opacity: 0.3
          }
        : undefined,

      // 强调样式
      emphasis: {
        focus: "series",
        lineStyle: {
          width: props.lineWidth + 1
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, 0.2)"
        }
      },

      // 动画配置
      animationDuration: 1500,
      animationEasing: "cubicOut",
      animationDelay: (idx: number) => idx * 50 // 逐个动画
    }))
  } as EChartsOption;
});
</script>

<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>
