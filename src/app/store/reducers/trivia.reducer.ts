import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Action, createReducer, on } from "@ngrx/store";
import { IQuestion } from "src/app/modules/trivia/interfaces/question.interface";
import { NUM_OF_RETRIES } from "src/app/utils/consts";
import * as TriviaActions from "../actions/trivia.actions";

export interface TriviaState extends EntityState<IQuestion> {
  error: string | null;
}

export const adapter: EntityAdapter<IQuestion> = createEntityAdapter<IQuestion>();
const initialState: TriviaState = adapter.getInitialState({
  entities: [],
  error: null,
});
const triviaReducer = createReducer(
  initialState,
  on(TriviaActions.questionFetchSuccess, (state, { question }) => {
    return adapter.addOne(question, { ...state, currentQuestion: question });
  }),
  on(TriviaActions.questionFetchFail, (state, { error }) => {
    return { ...state, error };
  })
);

export function reducer(state: TriviaState | undefined, action: Action) {
  return triviaReducer(state, action);
}
