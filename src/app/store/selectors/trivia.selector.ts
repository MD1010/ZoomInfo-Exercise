import { createSelector, createFeatureSelector } from "@ngrx/store";
import { AppState } from "../app-state";
import { TriviaState } from "../reducers";

const triviaStateSelector = createFeatureSelector<AppState, TriviaState>("trivia");
export const getCurrentQuestion = createSelector(triviaStateSelector, (state: TriviaState) => state.currentQuestion);
// import { AppState, getUsersState } from "../app-store";
// import { UsersTableState } from "../reducers/question.reducer";
// import { usersAdapter } from "../reducers/question.reducer";

// export const getUserTableState = createSelector(getUsersState, (state: AppState) => state.usersTable);
// // user table selectors
// export const getUsersByPage = createSelector(getUserTableState, (state: UsersTableState) => state.usersByPage);
// export const getAllUsers = createSelector(getUserTableState, usersAdapter.getSelectors().selectAll);
// export const getAllEntities = createSelector(getUserTableState, usersAdapter.getSelectors().selectEntities);
// export const getAllIds = createSelector(getUserTableState, usersAdapter.getSelectors().selectIds);
// export const getIsUsersPageLoading = createSelector(getUserTableState, (state: UsersTableState) => state.isLoading);
// export const getFetchPageError = createSelector(getUserTableState, (state: UsersTableState) => state.error);
