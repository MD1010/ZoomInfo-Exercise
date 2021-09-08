import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Action, createReducer, on } from "@ngrx/store";
import { Question } from "src/app/modules/trivia/models/question.model";
import { NUM_OF_RETRIES } from "src/app/utils/consts";
import * as TriviaActions from "../actions/trivia.actions";

export interface TriviaState extends EntityState<Question> {
  wrongAnswers: Question[];
  currentQuestion: Question | null;
  lastQuestionRetriesLeft: number;
  error: string | null;
}

export const adapter: EntityAdapter<Question> = createEntityAdapter<Question>();
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
    console.log("success reducer!!");
    return adapter.addOne(question, { ...state, currentQuestion: question });
  }),
  on(TriviaActions.questionFetchFail, (state, { error }) => {
    return { ...state, error };
  }),
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
