import { createAction, props } from "@ngrx/store";
import { IQuestion } from "src/app/modules/trivia/interfaces/question.interface";

export const loadNextQuestion = createAction("[Trivia] Load Next Question");
export const questionFetchSuccess = createAction(
  "[Trivia] Load Next Question Success",
  props<{ question: IQuestion }>()
);
export const questionFetchFail = createAction("[Trivia] Load Next Question Failed", props<{ error: string }>());
export const timeExpired = createAction("[Trivia] Question time expired");
// mark question as wrong after max retries expired
export const submitWrongAnswer = createAction("[Trivia] Question answer submitted", props<{ question: IQuestion }>());
