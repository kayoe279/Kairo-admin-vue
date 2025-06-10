import { PaginationProps as NaivePaginationProps } from "naive-ui";

export type PaginationProps = Pick<
  NaivePaginationProps,
  | "page"
  | "pageSize"
  | "pageCount"
  | "itemCount"
  | "pageSizes"
  | "showSizePicker"
  | "showQuickJumper"
  | "prefix"
>;
