import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { difference } from 'lodash';
import { Observable, of } from 'rxjs';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';
import { PageRequest } from '../models/page-request.model';
import { User } from '../models/user.model';
import { buildRequestParams } from '../utils/helpers';

@Injectable({
  providedIn: 'root',
})
export class UsersTableService {
  constructor(private http: HttpService) {}

  fetchRequestedPageUsersIds(request: PageRequest<User>): Observable<string[]> {
    const { pageNumber: pageNumber, sortBy: { order: sortDir = null, property: sortBy = null } = {}, itemsPerFetch } = request;
    const params = buildRequestParams({ page: pageNumber, limit: itemsPerFetch, sort: sortBy, sortDir });
    return this.http.get<string[]>(`${environment.apiEndpoint}/users`, params);
  }

  fetchUsersData(ids: string[]): Observable<User[]> {
    return this.http.post<User[]>(`${environment.apiEndpoint}/users`, { ids });
  }

  checkIfPageWasLoadedPreviously(usersByPage: Dictionary<User[]>, pageNumber: number) {
    return Object.keys(usersByPage).includes(pageNumber.toString());
  }

  getNewIdsToFetch(requestedIds: string[], existingEntities: Dictionary<User>): Observable<string[]> {
    return of(difference(requestedIds, Object.keys(existingEntities)));
  }

  getCachedUsers(requestedIds: string[], existingEntities: Dictionary<User>) {
    const requestedCachedUsers = [];
    for (const [id, user] of Object.entries(existingEntities)) {
      if (requestedIds.includes(id)) {
        requestedCachedUsers.push(user);
      }
    }
    return requestedCachedUsers;
  }
}
