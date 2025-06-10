import type { ComponentType } from "./componentType";
import type { PaginationProps } from "./pagination";
import type {
  DataTableBaseColumn,
  DataTableColumn,
  DataTableCreateSummary,
  DataTableFilterState,
  DataTableGetCsvHeader,
  DataTableSortState,
  PopoverProps,
  ScrollbarProps
} from "naive-ui";
import { InternalRowData, TableBaseColumn } from "naive-ui/es/data-table/src/interface";
import type { HTMLAttributes, MaybeRef, VNodeChild } from "vue";

export type Recordable<T = any> = Record<string, T>;

export interface BasicColumn<T = InternalRowData> extends TableBaseColumn<T> {
  //编辑表格
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
}

export interface TableActionType {
  refetch: (opt?: Record<string, any>) => Promise<Service.ResponseResult<any>>;
  emit?: any;
  getColumns: (opt?) => BasicColumn[];
  setColumns: (columns: BasicColumn[] | string[]) => void;
}

export interface CustomTableProps {
  title?: string;
  showSize?: boolean;
  showPagination?: boolean;
  filters?: MaybeRef<Record<string, any>>;
  request?: (params?: Record<string, any>) => Promise<any>;
  beforeRequest?: (params: Recordable) => Promise<any>;
  afterRequest?: (params: Recordable) => Promise<any>;
}

export interface TableColumn extends Omit<DataTableColumn, "key"> {
  key: string;
}

export interface TableProps {
  // 基础属性
  bordered?: boolean;
  bottomBordered?: boolean;
  columns?: TableColumn[];
  data?: object[];
  loading?: boolean;
  size?: "small" | "medium" | "large";
  striped?: boolean;
  tableLayout?: "auto" | "fixed";

  // 分页相关
  pagination?: PaginationProps | false;
  paginateSinglePage?: boolean;
  paginationBehaviorOnFilter?: "first" | "current";
  remote?: boolean;

  // 行相关
  rowClassName?: string | ((rowData: object, index: number) => string);
  rowKey?: (rowData: object) => number | string;
  rowProps?: (rowData: object, rowIndex: number) => HTMLAttributes;

  // 选择相关
  checkedRowKeys?: Array<string | number>;
  defaultCheckedRowKeys?: Array<string | number>;
  allowCheckingNotLoaded?: boolean;
  cascade?: boolean;

  // 展开相关
  expandedRowKeys?: Array<string | number>;
  defaultExpandedRowKeys?: Array<string | number>;
  defaultExpandAll?: boolean;
  stickyExpandedRows?: boolean;

  // 树形数据相关
  childrenKey?: string;
  indent?: number;

  // 虚拟滚动相关
  virtualScroll?: boolean;
  virtualScrollHeader?: boolean;
  virtualScrollX?: boolean;
  headerHeight?: number;
  minRowHeight?: number;
  heightForRow?: (rowData: object, index: number) => number;

  // 滚动相关
  scrollX?: number | string;
  maxHeight?: number | string;
  minHeight?: number | string;
  scrollbarProps?: ScrollbarProps;

  // 样式相关
  singleColumn?: boolean;
  singleLine?: boolean;
  flexHeight?: boolean;
  spinProps?: { strokeWidth?: number; stroke?: string };

  // 总结栏相关
  summary?: DataTableCreateSummary;
  summaryPlacement?: "top" | "bottom";

  // 过滤相关
  filterIconPopoverProps?: PopoverProps;

  // CSV 导出相关
  getCsvCell?: (value: any, row: object, col: DataTableBaseColumn) => string;
  getCsvHeader?: DataTableGetCsvHeader;

  // 自定义渲染
  renderCell?: (value: any, rowData: object, column: DataTableBaseColumn) => VNodeChild;
  renderExpandIcon?: (options: { expanded: boolean; rowData: object }) => VNodeChild;

  // 事件回调
  onLoad?: (rowData: object) => Promise<void>;
  onScroll?: (e: Event) => void;
  onUpdateCheckedRowKeys?: (
    keys: Array<string | number>,
    rows: object[],
    meta: { row: object | undefined; action: "check" | "uncheck" | "checkAll" | "uncheckAll" }
  ) => void;
  onUpdateExpandedRowKeys?: (keys: Array<string | number>) => void;
  onUpdateFilters?: (filters: DataTableFilterState, initiatorColumn: DataTableBaseColumn) => void;
  onUpdatePage?: (page: number) => void;
  onUpdatePageSize?: (pageSize: number) => void;
  onUpdateSorter?: (options: DataTableSortState | DataTableSortState[] | null) => void;
}

export interface BasicTableProps extends CustomTableProps, TableProps {}
