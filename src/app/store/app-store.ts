import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { usersTableReducer, UsersTableState } from './reducers/user-table.reducer';

export interface AppState {
  usersTable: UsersTableState;
}

export const reducers: ActionReducerMap<AppState> = {
  usersTable: usersTableReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];

export const getUsersState = createFeatureSelector<AppState>('users');
