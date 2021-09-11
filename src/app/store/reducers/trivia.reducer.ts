import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Action, createReducer, on } from "@ngrx/store";
import { IQuestion } from "src/app/modules/trivia/interfaces/question.interface";
import * as TriviaActions from "../actions/trivia.actions";

export interface TriviaState extends EntityState<IQuestion> {
  error: string | null;
  isGameOver: boolean;
  numOfCorrectAnswers: number;
}

export const adapter: EntityAdapter<IQuestion> = createEntityAdapter<IQuestion>();
const initialState: TriviaState = adapter.getInitialState({
  entities: [],
  error: null,
  isGameOver: false,
  numOfCorrectAnswers: 0,
});
const triviaReducer = createReducer(
  initialState,
  on(TriviaActions.questionFetchSuccess, (state, { question }) => {
    return adapter.addOne(question, state);
  }),
  on(TriviaActions.questionFetchFail, (state, { error }) => {
    return { ...state, error };
  }),
  on(TriviaActions.quizOver, (state) => {
    return { ...state, isGameOver: true };
  }),
  on(TriviaActions.increaseCorrectAnswersCount, (state) => {
    const numOfCorrectAnswers = state.numOfCorrectAnswers + 1;
    return { ...state, numOfCorrectAnswers };
  })
);

export function reducer(state: TriviaState | undefined, action: Action) {
  return triviaReducer(state, action);
}
