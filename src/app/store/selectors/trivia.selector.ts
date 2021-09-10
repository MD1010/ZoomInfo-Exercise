import { createSelector, createFeatureSelector } from "@ngrx/store";
import { IQuestion } from "src/app/modules/trivia/interfaces/question.interface";
import { AppState } from "../app-state";
import { TriviaState } from "../reducers";

const triviaStateSelector = createFeatureSelector<AppState, TriviaState>("trivia");
export const getAllQuestions = createSelector(
  triviaStateSelector,
  (state: TriviaState) => Object.values(state.entities) as IQuestion[]
);
export const getFetchedQuestionsCount = createSelector(
  triviaStateSelector,
  (state: TriviaState) => Object.values(state.entities).length
);
