import { ActionReducerMap, createFeatureSelector, MetaReducer } from "@ngrx/store";
import { environment } from "src/environments/environment";
import { triviaReducer, TriviaState } from "./reducers";

export interface AppState {
  trivia: TriviaState;
}

export const reducers: ActionReducerMap<AppState> = {
  trivia: triviaReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];

export const getQuestionsState = createFeatureSelector<AppState>("questions");
