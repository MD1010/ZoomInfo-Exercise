import { PageRequest } from 'src/app/models/page-request.model';
import { User } from 'src/app/models/user.model';

export const pagedTableConfig: PageRequest<User> = {
  itemsPerFetch: 11,
  sortBy: { property: 'id', order: 'asc' },
  pageSize: 10,
  pageNumber: 0,
};
