import { createAction, props } from "@ngrx/store";
import { Question } from "src/app/modules/trivia/models/question.model";

export const setNextQuestion = createAction("[Questions] Load Next Question", props<{ question: Question }>());
export const timeExpired = createAction("[Questions] Question time expired");
// mark question as wrong after max retries expired
export const submitWrongAnswer = createAction("[Questions] Question answer submitted", props<{ question: Question }>());
