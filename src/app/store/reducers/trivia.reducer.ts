import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Action, createReducer, on } from "@ngrx/store";
import { IQuestion } from "src/app/modules/trivia/interfaces/question.interface";
import { NUM_OF_RETRIES } from "src/app/utils/consts";
import * as TriviaActions from "../actions/trivia.actions";

export interface TriviaState extends EntityState<IQuestion> {
  error: string | null;
  isGameOver: boolean;
  numOfCorrectAnswers: number;
  currentQuestiontriesLeft: number;
}

export const adapter: EntityAdapter<IQuestion> = createEntityAdapter<IQuestion>();
const initialState: TriviaState = adapter.getInitialState({
  entities: [],
  error: null,
  isGameOver: false,
  numOfCorrectAnswers: 0,
  currentQuestiontriesLeft: NUM_OF_RETRIES,
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
    console.log("WHAT");
    return { ...state, numOfCorrectAnswers };
  }),
  on(TriviaActions.decreaseNumberOfTries, (state) => {
    const currentQuestiontriesLeft = state.currentQuestiontriesLeft - 1;
    return { ...state, currentQuestiontriesLeft };
  }),
  on(TriviaActions.resetNumberOfTries, (state) => {
    return { ...state, currentQuestiontriesLeft: NUM_OF_RETRIES };
  })
);

export function reducer(state: TriviaState | undefined, action: Action) {
  return triviaReducer(state, action);
}
