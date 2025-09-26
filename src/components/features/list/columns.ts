import SvgIcon from "@/components/ui/SvgIcon.vue";
import { type NavListItem } from "@/service";
import { type DataTableColumns } from "naive-ui";
import { NButton, NEllipsis, NSpace, NTag, NTooltip } from "naive-ui";
import { type VNode, h } from "vue";

// 图标组件 - 使用 Solar 图标集
const EyeIcon = () => h(SvgIcon, { icon: "solar:eye-linear", size: 16 });
const EditIcon = () => h(SvgIcon, { icon: "solar:pen-linear", size: 16 });
const CheckIcon = () => h(SvgIcon, { icon: "solar:check-circle-linear", size: 16 });
const XIcon = () => h(SvgIcon, { icon: "solar:close-circle-linear", size: 16 });
const TrashIcon = () => h(SvgIcon, { icon: "solar:trash-bin-trash-linear", size: 16 });
const LinkIcon = () => h(SvgIcon, { icon: "solar:link-linear", size: 16 });
const GithubIcon = () => h(SvgIcon, { icon: "solar:repository-linear", size: 16 });

// 操作列配置接口
export interface ColumnActions {
  onEdit?: (record: NavListItem) => void;
  onDisable?: (record: NavListItem) => void;
  onDelete?: (record: NavListItem) => void;
  onView?: (record: NavListItem) => void;
}

// 创建基础 columns 配置
export const createNavListColumns = (): DataTableColumns<NavListItem> => [
  {
    title: "ID",
    key: "id",
    width: 80,
    sorter: true,
    render: (row) => h("span", { class: "font-medium text-gray-900 dark:text-gray-100" }, row.id)
  },
  {
    title: "名称",
    key: "name",
    width: 200,
    ellipsis: {
      tooltip: true
    },
    render: (row) =>
      h(
        NEllipsis,
        { style: "max-width: 180px" },
        {
          default: () =>
            h("span", { class: "font-medium text-gray-900 dark:text-gray-100" }, row.name),
          tooltip: () => row.name
        }
      )
  },
  {
    title: "链接",
    key: "link",
    width: 300,
    ellipsis: {
      tooltip: true
    },
    render: (row) =>
      h(
        NTooltip,
        {},
        {
          trigger: () =>
            h(
              "a",
              {
                href: row.link,
                target: "_blank",
                rel: "noopener noreferrer",
                class:
                  "flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              },
              [
                h(LinkIcon),
                h(NEllipsis, { style: "max-width: 250px" }, { default: () => row.link })
              ]
            ),
          default: () => row.link
        }
      )
  },
  {
    title: "关键词",
    key: "keywords",
    width: 250,
    render: (row) =>
      h(
        "div",
        { class: "flex flex-wrap gap-1" },
        row.keywords?.map((keyword, index) =>
          h(
            NTag,
            {
              key: index,
              type: "info",
              size: "small"
            },
            { default: () => keyword }
          )
        ) || h("span", { class: "text-gray-400 dark:text-gray-500" }, "-")
      )
  },
  {
    title: "仓库",
    key: "repository",
    width: 200,
    ellipsis: {
      tooltip: true
    },
    render: (row) => {
      if (!row.repository) {
        return h("span", { class: "text-gray-400 dark:text-gray-500" }, "-");
      }
      return h(
        NTooltip,
        {},
        {
          trigger: () =>
            h(
              "a",
              {
                href: row.repository,
                target: "_blank",
                rel: "noopener noreferrer",
                class:
                  "flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              },
              [
                h(GithubIcon),
                h(NEllipsis, { style: "max-width: 150px" }, { default: () => row.repository })
              ]
            ),
          default: () => row.repository
        }
      );
    }
  },
  {
    title: "创建时间",
    key: "created_at",
    width: 180,
    sorter: true,
    render: (row) => {
      if (!row.created_at) return "-";
      return new Date(row.created_at).toLocaleString("zh-CN");
    }
  }
];

// 创建操作列
export const createActionColumn = (actions: ColumnActions): DataTableColumns<NavListItem>[0] => ({
  title: "操作",
  key: "action",
  width: 250,
  fixed: "right",
  render: (row) =>
    h(
      NSpace,
      { size: "medium" },
      {
        default: () =>
          [
            actions.onView &&
              h(
                NButton,
                {
                  text: true,
                  size: "small",
                  onClick: () => actions.onView!(row)
                },
                {
                  default: () => "查看",
                  icon: () => h(EyeIcon)
                }
              ),
            actions.onEdit &&
              h(
                NButton,
                {
                  text: true,
                  size: "small",
                  onClick: () => actions.onEdit!(row)
                },
                {
                  default: () => "编辑",
                  icon: () => h(EditIcon)
                }
              ),
            actions.onDisable &&
              h(
                NButton,
                {
                  text: true,
                  size: "small",
                  type: row.disabled ? "warning" : "success",
                  onClick: () => actions.onDisable!(row)
                },
                {
                  default: () => (row.disabled ? "禁用" : "启用"),
                  icon: () => h(row.disabled ? XIcon : CheckIcon)
                }
              ),
            actions.onDelete &&
              h(
                NButton,
                {
                  text: true,
                  size: "small",
                  type: "error",
                  onClick: () => actions.onDelete!(row)
                },
                {
                  default: () => "删除",
                  icon: () => h(TrashIcon)
                }
              )
          ].filter(Boolean) as VNode[]
      }
    )
});

// 完整的 columns 配置函数
export const createNavListTableColumns = ({
  showActions = true,
  actions
}: {
  showActions?: boolean;
  actions?: ColumnActions;
}): DataTableColumns<NavListItem> => {
  const baseColumns = createNavListColumns();

  if (showActions && actions) {
    return [...baseColumns, createActionColumn(actions)];
  }

  return baseColumns;
};
