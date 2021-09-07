import { Action } from '@ngrx/store';
import { User } from 'src/app/models/user.model';
import { PageRequest } from 'src/app/models/page-request.model';
import { SuccessfulPageRequest } from 'src/app/models/successful-page-request.model';

export const LOAD_PAGE = '[UsersTable] Load Users Page';
export const LOAD_PAGE_FAIL = '[UsersTable] Load Users Page Fail';
export const LOAD_PAGE_SUCCESS = '[UsersTable] Load Users Page Success';

export class LoadPage implements Action {
  readonly type = LOAD_PAGE;
  constructor(public payload: PageRequest<User>) {}
}
export class LoadPageFail implements Action {
  readonly type = LOAD_PAGE_FAIL;
  constructor(public payload: string) {}
}

export class LoadPageSuccess implements Action {
  readonly type = LOAD_PAGE_SUCCESS;
  constructor(public payload: SuccessfulPageRequest<User>) {}
}

export type UsersTableActions = LoadPage | LoadPageFail | LoadPageSuccess;

// action creators
export const loadPage = (payload: PageRequest<User>) => new LoadPage(payload);
export const loadPageFail = (payload: string) => new LoadPageFail(payload);
export const loadPageSuccess = (payload: SuccessfulPageRequest<User>) => new LoadPageSuccess(payload);
