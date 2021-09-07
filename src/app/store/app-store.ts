import { ActionReducerMap, createFeatureSelector, MetaReducer } from "@ngrx/store";
import { environment } from "src/environments/environment";
import { QuestionsState, questionReducer } from "./reducers";

export interface AppState {
  questions: QuestionsState;
}

export const reducers: ActionReducerMap<AppState> = {
  questions: questionReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];

export const getQuestionsState = createFeatureSelector<AppState>("questions");
