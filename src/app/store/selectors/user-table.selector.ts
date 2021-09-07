import { createSelector } from '@ngrx/store';
import { AppState, getUsersState } from '../app-store';
import { UsersTableState } from '../reducers/user-table.reducer';
import { usersAdapter } from './../reducers/user-table.reducer';

export const getUserTableState = createSelector(getUsersState, (state: AppState) => state.usersTable);
// user table selectors
export const getUsersByPage = createSelector(getUserTableState, (state: UsersTableState) => state.usersByPage);
export const getAllUsers = createSelector(getUserTableState, usersAdapter.getSelectors().selectAll);
export const getAllEntities = createSelector(getUserTableState, usersAdapter.getSelectors().selectEntities);
export const getAllIds = createSelector(getUserTableState, usersAdapter.getSelectors().selectIds);
export const getIsUsersPageLoading = createSelector(getUserTableState, (state: UsersTableState) => state.isLoading);
export const getFetchPageError = createSelector(getUserTableState, (state: UsersTableState) => state.error);
