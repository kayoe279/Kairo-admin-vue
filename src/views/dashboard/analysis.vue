<template>
  <div class="flex flex-col gap-4">
    <!-- 页面标题 -->
    <NCard title="数据分析"> 业务数据分析和统计页面 </NCard>

    <!-- 图表展示区域 -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- 柱状图 - 月度销售数据 -->
      <NCard title="月度销售数据" class="h-fit">
        <BarChart
          title="月度销售统计"
          :data="barChartData"
          :show-label="true"
          :use-gradient="true"
          :style="{ height: '350px' }"
        />
      </NCard>

      <!-- 饼状图 - 系统资源使用 -->
      <NCard title="系统资源使用" class="h-fit">
        <PieChart
          title="资源使用情况"
          :data="pieChartData"
          :show-label="true"
          :show-label-line="true"
          :style="{ height: '350px' }"
        />
      </NCard>
    </div>

    <!-- 折线图 - 用户活跃度趋势 -->
    <NCard title="用户活跃度趋势">
      <LineChart
        title="用户活跃度变化趋势"
        :data="lineChartData"
        :x-axis-data="lineChartXAxis"
        :show-area="true"
        :smooth="true"
        :show-symbol="true"
        :style="{ height: '400px' }"
      />
    </NCard>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- 水平柱状图 - 部门绩效 -->
      <NCard title="部门绩效排名" class="h-fit">
        <BarChart
          title="各部门绩效对比"
          :data="departmentData"
          :horizontal="true"
          :use-gradient="true"
          :show-label="true"
          :style="{ height: '350px' }"
        />
      </NCard>

      <!-- 环形图 - 产品销售占比 -->
      <NCard title="产品销售占比" class="h-fit">
        <PieChart
          title="产品类别销售分布"
          :data="productSalesData"
          inner-radius="40%"
          outer-radius="70%"
          :show-label="true"
          :show-label-line="false"
          :style="{ height: '350px' }"
        />
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 数据分析页面
 * 展示系统各项指标的图表数据
 */

// 柱状图数据 - 月度销售数据
const barChartData = [
  { name: "1月", value: 2400 },
  { name: "2月", value: 1398 },
  { name: "3月", value: 9800 },
  { name: "4月", value: 3908 },
  { name: "5月", value: 4800 },
  { name: "6月", value: 3800 }
];

// 折线图数据 - 用户活跃度趋势
const lineChartData = [
  {
    name: "活跃用户",
    data: [820, 932, 901, 934, 1290, 1330, 1320, 1200, 1100, 950, 1000, 1150]
  },
  {
    name: "新增用户",
    data: [320, 432, 501, 634, 890, 930, 820, 700, 600, 450, 500, 650]
  }
];

const lineChartXAxis = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月"
];

// 饼状图数据 - 系统资源使用情况
const pieChartData = [
  { name: "CPU使用率", value: 35 },
  { name: "内存使用率", value: 25 },
  { name: "磁盘使用率", value: 18 },
  { name: "网络带宽", value: 15 },
  { name: "其他", value: 7 }
];

// 部门绩效数据
const departmentData = [
  { name: "技术部", value: 95 },
  { name: "销售部", value: 88 },
  { name: "市场部", value: 82 },
  { name: "运营部", value: 79 },
  { name: "财务部", value: 85 }
];

// 产品销售占比数据
const productSalesData = [
  { name: "手机", value: 40 },
  { name: "电脑", value: 30 },
  { name: "平板", value: 20 },
  { name: "配件", value: 10 }
];
</script>
