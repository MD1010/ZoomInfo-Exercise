import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Action, createReducer, on } from "@ngrx/store";
import { Question } from "src/app/modules/trivia/models/question.model";
import { NUM_OF_RETRIES } from "src/app/utils/consts";
import * as QuestionActions from "../actions/question.actions";

export interface QuestionsState extends EntityState<Question> {
  wrongAnswers: Question[];
  currentQuestion: Question | null;
  questionRetries: number;
  error: string | null;
}

export const adapter: EntityAdapter<Question> = createEntityAdapter<Question>();
const initialState: QuestionsState = adapter.getInitialState({
  wrongAnswers: [],
  entities: [],
  currentQuestion: null,
  currentlyDisplayedQuestion: null,
  questionRetries: NUM_OF_RETRIES,
  error: null,
});
const questionReducer = createReducer(
  initialState,
  on(QuestionActions.setNextQuestion, (state, { question }) => {
    return { ...state, currentQuestion: question };
  }),
  on(QuestionActions.submitWrongAnswer, (state, { question }) => {
    return { ...state, questionRetries: state.questionRetries - 1, wrongAnswers: [...state.wrongAnswers, question] };
  })
);

export function reducer(state: QuestionsState | undefined, action: Action) {
  return questionReducer(state, action);
}
