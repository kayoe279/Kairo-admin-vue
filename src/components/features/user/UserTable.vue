<script setup lang="ts">
import SvgIcon from "@/components/ui/SvgIcon.vue";
import { cn } from "@/lib";
import { getTableList } from "@/service/api/list";
import type { User } from "@/types";
import {
  type DataTableColumns,
  NAvatar,
  NButton,
  NSpace,
  NTag,
  useDialog,
  useMessage
} from "naive-ui";
import { h, ref } from "vue";

type UserTableProps = {
  collapsed?: boolean;
  searchParams?: Record<string, any>;
};

withDefaults(defineProps<UserTableProps>(), {
  collapsed: false,
  searchParams: () => ({})
});

// 表格列配置
const columns: DataTableColumns<User> = [
  {
    title: "头像",
    key: "avatar",
    width: 80,
    render(row) {
      return h(NAvatar, {
        src: row.avatar,
        size: 40,
        round: true
      });
    }
  },
  {
    title: "姓名",
    key: "name",
    width: 120
  },
  {
    title: "性别",
    key: "sex",
    width: 80,
    render(row) {
      return h(
        NTag,
        {
          type: row.sex === "male" ? "info" : "success",
          size: "small"
        },
        {
          default: () => (row.sex === "male" ? "男" : "女")
        }
      );
    }
  },
  {
    title: "邮箱",
    key: "email",
    width: 200
  },
  {
    title: "城市",
    key: "city",
    width: 120
  },
  {
    title: "状态",
    key: "status",
    width: 100,
    render(row) {
      const statusConfig = {
        pass: { type: "success", label: "通过" },
        refuse: { type: "error", label: "拒绝" },
        close: { type: "warning", label: "关闭" }
      };
      const config = statusConfig[row.status] || { type: "default", label: row.status };

      return h(NTag, { type: config.type as any }, { default: () => config.label });
    }
  },
  {
    title: "类型",
    key: "type",
    width: 100,
    render(row) {
      return row.type === "person" ? "个人" : "公司";
    }
  },
  {
    title: "创建时间",
    key: "createDate",
    width: 180
  },
  {
    title: "操作",
    key: "actions",
    width: 200,
    render(row) {
      return h(
        NSpace,
        { size: "small" },
        {
          default: () => [
            h(
              NButton,
              {
                size: "small",
                type: "info",
                text: true,
                onClick: () => handleView(row)
              },
              {
                default: () => "查看",
                icon: () => h(SvgIcon, { icon: "solar:eye-bold" })
              }
            ),
            h(
              NButton,
              {
                size: "small",
                type: "primary",
                text: true,
                onClick: () => handleEdit(row)
              },
              {
                default: () => "编辑",
                icon: () => h(SvgIcon, { icon: "solar:pen-bold" })
              }
            ),
            h(
              NButton,
              {
                size: "small",
                type: "error",
                text: true,
                onClick: () => handleDelete(row)
              },
              {
                default: () => "删除",
                icon: () => h(SvgIcon, { icon: "solar:trash-bin-trash-bold" })
              }
            )
          ]
        }
      );
    }
  }
];

const message = useMessage();
const dialog = useDialog();

const reCalcHeight = defineModel<boolean>("collapsed");

// 表格引用
const advancedTableRef = ref();

// 处理查看
const handleView = (row: User) => {
  message?.info(`查看用户详情: ${row.name}`);
};

// 处理编辑
const handleEdit = (row: User) => {
  message?.info(`编辑用户: ${row.name}`);
};

// 处理删除
const handleDelete = (row: User) => {
  dialog?.warning({
    title: "确认删除",
    content: `确定要删除用户 ${row.name} 吗？`,
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      message?.success(`用户 ${row.name} 已删除`);
    }
  });
};

// 添加用户
const handleAdd = () => {
  message?.info("添加用户功能开发中...");
};

// 批量导出
const handleExport = () => {
  message?.info("导出功能开发中...");
};

// 刷新表格
const handleRefresh = () => {
  advancedTableRef.value?.refresh();
};
</script>

<template>
  <NCard>
    <BasicTable
      ref="advancedTableRef"
      :columns="columns"
      :api-function="getTableList"
      :search-params="searchParams"
      :re-calc-height="reCalcHeight"
    >
      <template #headerLeft>
        <NSpace>
          <NButton type="primary" @click="handleAdd">
            <template #icon>
              <SvgIcon icon="solar:user-rounded-outline" />
            </template>
            新增用户
          </NButton>
        </NSpace>
      </template>
      <template #headerRight>
        <div class="flex items-center gap-4">
          <ButtonIcon
            icon="solar:refresh-bold"
            :class="cn({ 'pointer-events-none animate-spin': advancedTableRef?.loading })"
            :tooltip-content="$t('common.reload')"
            @click="handleRefresh"
          />
          <NButton @click="handleExport">
            <template #icon>
              <SvgIcon icon="solar:export-bold" />
            </template>
            导出数据
          </NButton>
        </div>
      </template>
    </BasicTable>
  </NCard>
</template>
