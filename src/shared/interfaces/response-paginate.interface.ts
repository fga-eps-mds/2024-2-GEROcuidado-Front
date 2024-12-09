export interface ResponsePaginate<T> {
  data: T | Array<T>;
  count: number;
  pageSize: number;
}
