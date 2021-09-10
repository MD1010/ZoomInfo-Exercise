import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Action, createReducer, on } from "@ngrx/store";
import { IQuestion } from "src/app/modules/trivia/interfaces/question.interface";
import { NUM_OF_RETRIES } from "src/app/utils/consts";
import * as TriviaActions from "../actions/trivia.actions";

export interface TriviaState extends EntityState<IQuestion> {
  wrongAnswers: IQuestion[];
  currentQuestion: IQuestion | null;
  lastQuestionRetriesLeft: number;
  error: string | null;
}

export const adapter: EntityAdapter<IQuestion> = createEntityAdapter<IQuestion>();
const initialState: TriviaState = adapter.getInitialState({
  wrongAnswers: [],
  entities: [],
  currentQuestion: null,
  lastQuestionRetriesLeft: NUM_OF_RETRIES,
  error: null,
});
const triviaReducer = createReducer(
  initialState,
  on(TriviaActions.questionFetchSuccess, (state, { question }) => {
    return adapter.addOne(question, { ...state, currentQuestion: question });
  }),
  on(TriviaActions.questionFetchFail, (state, { error }) => {
    return { ...state, error };
  }),
  // on(TriviaActions.resetTimer, (state) => {
  //   return adapter.addOne(question, { ...state, currentQuestion: question });
  // }),
  on(TriviaActions.submitWrongAnswer, (state, { question }) => {
    return {
      ...state,
      lastQuestionRetriesLeft: state.lastQuestionRetriesLeft - 1,
      wrongAnswers: [...state.wrongAnswers, question],
    };
  })
);

export function reducer(state: TriviaState | undefined, action: Action) {
  return triviaReducer(state, action);
}
