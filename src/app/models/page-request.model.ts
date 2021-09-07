import { Sort } from './sort.model';

export interface PageRequest<T> {
  pageNumber: number;
  itemsPerFetch: number;
  sortBy?: Sort<T>;
  pageSize: number;
}
