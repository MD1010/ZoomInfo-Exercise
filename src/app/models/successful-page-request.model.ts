export interface SuccessfulPageRequest<T> {
  content: T[];
  pageSize: number;
  pageNumber: number;
}
