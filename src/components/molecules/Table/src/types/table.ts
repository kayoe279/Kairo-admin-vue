import type { ComponentType } from "./componentType";
import { InternalRowData, TableBaseColumn } from "naive-ui/es/data-table/src/interface";
import type { HTMLAttributes, VNodeChild } from "vue";

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
  reload: (opt) => Promise<void>;
  emit?: any;
  getColumns: (opt?) => BasicColumn[];
  setColumns: (columns: BasicColumn[] | string[]) => void;
}

export interface BasicTableProps {
  title?: string;
  allowCheckingNotLoaded?: boolean;
  bordered?: boolean;
  bottomBordered?: boolean;
  checkedRowKeys?: Array<string | number>;
  cascade?: boolean;
  childrenKey?: string;
  columns?: Array<any>;
  data?: Array<any>;
  defaultCheckedRowKeys?: Array<string | number>;
  defaultExpandedRowKeys?: Array<string | number>;
  defaultExpandAll?: boolean;
  expandedRowKeys?: Array<string | number>;
  filterIconPopoverProps?: Record<string, any>;
  flexHeight?: boolean;
  getCsvCell?: (value: any, row: any, col: TableBaseColumn) => string;
  getCsvHeader?: (cols: any) => string;
  headerHeight?: number;
  heightForRow?: (rowData: any, index: number) => number;
  indent?: number;
  loading?: boolean;
  maxHeight?: number | string;
  minHeight?: number | string;
  minRowHeight?: number;
  paginateSinglePage?: boolean;
  pagination?: false | any;
  paginationBehaviorOnFilter?: "first" | "current";
  remote?: boolean;
  renderCell?: (value: any, rowData: any, column: TableBaseColumn) => VNodeChild;
  renderExpandIcon?: (params: { expanded: boolean; rowData: any }) => VNodeChild;
  rowClassName?: string | ((rowData: any, index: number) => string);
  rowKey?: (rowData: any) => number | string;
  rowProps?: (rowData: any, rowIndex: number) => HTMLAttributes;
  scrollX?: number | string;
  scrollbarProps?: Record<string, any>;
  singleColumn?: boolean;
  singleLine?: boolean;
  showSize?: boolean;
  size?: "small" | "medium" | "large";
  spinProps?: { strokeWidth?: number; stroke?: string };
  stickyExpandedRows?: boolean;
  striped?: boolean;
  summary?: (data: any[]) => any[];
  summaryPlacement?: "top" | "bottom";
  tableLayout?: "auto" | "fixed";
  virtualScroll?: boolean;
  virtualScrollHeader?: boolean;
  virtualScrollX?: boolean;
  onLoad?: (rowData: any) => Promise<void>;
  onScroll?: (e: Event) => void;
  onUpdateCheckedRowKeys?: (checkedRowKeys: Array<string | number>) => void;
  onUpdateExpandedRowKeys?: (expandedRowKeys: Array<string | number>) => void;
  onUpdateFilters?: (filters: Record<string, any>) => void;
  onUpdatePage?: (page: number) => void;
  onUpdatePageSize?: (pageSize: number) => void;
  onUpdateSorter?: (sorter: Record<string, any>) => void;
}
