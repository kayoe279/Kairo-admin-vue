<script setup lang="ts">
import { CHART_COLORS, DEFAULT_LEGEND, DEFAULT_TITLE, PIE_TOOLTIP } from "./chartConfig";
import type { EChartsOption } from "echarts";
import { computed } from "vue";

export interface PieChartData {
  name: string;
  value: number;
}

export interface PieChartProps {
  /** 图表标题 */
  title?: string;
  /** 数据 */
  data: PieChartData[];
  /** 是否显示标签 */
  showLabel?: boolean;
  /** 是否显示标签线 */
  showLabelLine?: boolean;
  /** 内半径（环形图） */
  innerRadius?: string | number;
  /** 外半径 */
  outerRadius?: string | number;
  /** 中心位置 */
  center?: [string | number, string | number];
  /** 玫瑰图类型 */
  roseType?: "radius" | "area" | false;
}

// 定义 props
const props = withDefaults(defineProps<PieChartProps>(), {
  showLabel: true,
  showLabelLine: true,
  innerRadius: 0,
  outerRadius: "70%",
  center: () => ["50%", "50%"],
  roseType: false
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
      ...PIE_TOOLTIP,
      formatter: (params: any) => {
        const { name, value, percent } = params;
        return `
          <div style="padding: 8px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${name}</div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="color: ${CHART_COLORS.textSecondary};">数值: <strong style="color: ${CHART_COLORS.text};">${value}</strong></span>
              <span style="color: ${CHART_COLORS.textSecondary};">占比: <strong style="color: ${CHART_COLORS.primary[0]};">${percent}%</strong></span>
            </div>
          </div>
        `;
      }
    },

    legend: {
      ...DEFAULT_LEGEND,
      data: props.data.map((item) => item.name)
    },

    series: [
      {
        name: "数据",
        type: "pie" as const,
        radius: [props.innerRadius, props.outerRadius],
        center: props.center,
        data: props.data.map((item, index) => ({
          ...item,
          itemStyle: {
            color: CHART_COLORS.primary[index % CHART_COLORS.primary.length],
            borderRadius: 6,
            borderColor: "#ffffff",
            borderWidth: 2
          }
        })),

        // 玫瑰图配置
        roseType: props.roseType || undefined,

        // 标签配置
        label: props.showLabel
          ? {
              show: true,
              position: "outside",
              formatter: "{b}: {c} ({d}%)",
              fontSize: 12,
              color: CHART_COLORS.text,
              fontWeight: 500
            }
          : {
              show: false
            },

        // 标签线配置
        labelLine:
          props.showLabelLine && props.showLabel
            ? {
                show: true,
                length: 15,
                length2: 20,
                smooth: true,
                lineStyle: {
                  color: CHART_COLORS.border,
                  width: 1
                }
              }
            : {
                show: false
              },

        // 强调样式
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowColor: "rgba(0, 0, 0, 0.2)",
            borderWidth: 3
          },
          label: {
            fontSize: 14,
            fontWeight: "bold"
          }
        },

        // 动画配置
        animationType: "scale",
        animationDuration: 1500,
        animationEasing: "elasticOut",
        animationDelay: (idx: number) => idx * 100
      }
    ]
  } as EChartsOption;
});
</script>

<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>
