import { NDataTable } from "naive-ui";
import type { DataTableColumn, PaginationProps } from "naive-ui";
import type {
  CreateRowKey,
  InternalRowData,
  TableBaseColumn
} from "naive-ui/lib/data-table/src/interface";
import type { PropType } from "vue";

export type ComponentType =
  | "NInput"
  | "NInputNumber"
  | "NSelect"
  | "NTreeSelect"
  | "NRadioGroup"
  | "NCheckboxGroup"
  | "NAutoComplete"
  | "NCascader"
  | "NDatePicker"
  | "NTimePicker"
  | "NSwitch"
  | "NUpload"
  | "NImageUpload"
  | "NEditor";

interface CustomTableProps {
  /** 标题 */
  title?: string;

  /** 标题提示 */
  titleTooltip?: string;

  /** 是否显示size选择 */
  showSize?: boolean;

  /** 分页查询前缀 */
  queryPrefix?: string;

  /** 总条数 */
  total?: number;

  /** 调整高度偏移 */
  resizeHeightOffset?: number;

  /** 最大高度 */
  maxHeight?: number;
}

export interface BasicTableProps extends CustomTableProps {
  /** 表格数据 */
  data?: Array<Record<string, any>>;

  /** 表头列配置 */
  columns: DataTableColumn[];

  /** 分页配置 */
  pagination?: PaginationProps;

  /** 边框 */
  bordered?: boolean;

  /** 是否远程模式（需要自己处理分页、数据） */
  remote?: boolean;

  /** 是否加载中 */
  loading?: boolean;

  /** 表格大小 */
  size?: "small" | "medium" | "large";

  /** 行是否可选 */
  rowKey?: CreateRowKey<any>;

  /** 空数据提示 */
  emptyText?: string;

  /** 点击行 */
  onRowClick?: (rowData: any, rowIndex: number) => void;

  /** 自定义每一行样式 */
  rowClassName?: (rowData: any, rowIndex: number) => string;
}

export interface BasicColumn<T = InternalRowData> extends TableBaseColumn<T> {
  // 编辑表格
  edit?: boolean;
  editRow?: boolean;
  editable?: boolean;
  editComponent?: ComponentType;
  editComponentProps?: Recordable;
  editRule?: boolean | ((text: string, record: Recordable) => Promise<string>);
  editValueMap?: (value: any) => string;
  onEditRow?: () => void;
  // 权限编码控制是否显示
  auth?: string[];
  // 业务控制是否显示
  ifShow?: boolean | ((column: BasicColumn) => boolean);
  // 控制是否支持拖拽，默认支持
  draggable?: boolean;
  // 是否必选
  required?: boolean;
}

export type Recordable<T = any> = Record<string, T>;

export interface TableActionType {
  // reload: (opt) => Promise<void>;
  emit?: any;
  getColumns: (opt?) => BasicColumn[];
  setColumns: (columns: BasicColumn[] | string[]) => void;
}

export const basicProps = {
  ...NDataTable.props,
  // 标题
  title: {
    type: String,
    default: null
  },
  // 标题提示
  titleTooltip: {
    type: String,
    default: null
  },
  // 表格大小
  size: {
    type: String,
    default: "medium"
  },
  // 数据源
  dataSource: {
    type: [Object, Array] as PropType<any[]>,
    default: () => []
  },
  // 列配置
  columns: {
    type: [Array] as PropType<BasicColumn[]>,
    default: () => [],
    required: true
  },
  // 请求前处理
  beforeRequest: {
    type: Function as PropType<(...arg: any[]) => void | Promise<any>>,
    default: null
  },
  // 请求方法
  request: {
    type: Function as PropType<(...arg: any[]) => Promise<any>>,
    default: null
  },
  // 请求后处理
  afterRequest: {
    type: Function as PropType<(...arg: any[]) => void | Promise<any>>,
    default: null
  },
  // 行 key
  rowKey: {
    type: [String, Function] as PropType<string | ((record: any) => string)>,
    default: undefined
  },
  // 分页配置
  pagination: {
    type: [Object, Boolean],
    default: () => ({})
  },
  // 是否显示分页
  showPagination: {
    type: [String, Boolean],
    default: "auto"
  },
  // 操作列配置
  actionColumn: {
    type: Object as PropType<BasicColumn>,
    default: null
  },
  // 是否可调整大小
  canResize: {
    type: Boolean,
    default: true
  },
  // 调整高度偏移
  resizeHeightOffset: {
    type: Number,
    default: 0
  },
  // 是否显示斑马纹
  striped: {
    type: Boolean,
    default: false
  }
};
