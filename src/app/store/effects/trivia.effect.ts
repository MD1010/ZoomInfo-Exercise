import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { EMPTY, of } from "rxjs";
import {
  catchError,
  filter,
  map,
  mergeMap,
  startWith,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import { TriviaService } from "src/app/modules/trivia/services/trivia.service";
import { MAX_QUESTIONS_DISPLAYED } from "src/app/utils/consts";
import * as TriviaActions from "../actions/trivia.actions";
import { AppState } from "../app-state";
import { getAllQuestions, getFetchedQuestionsCount } from "../selectors";

@Injectable()
export class TriviaEffects {
  constructor(private actions$: Actions, private triviaService: TriviaService, private store$: Store<AppState>) {}
  loadQuestion$ = createEffect(() =>
    this.actions$.pipe(
      filter((_) => MAX_QUESTIONS_DISPLAYED > 1), // do not dispatch load question when there is only one question
      startWith(TriviaActions.loadNextQuestion),
      ofType(TriviaActions.loadNextQuestion),
      withLatestFrom(this.store$.select(getFetchedQuestionsCount), this.store$.select(getAllQuestions)),
      mergeMap(([_, questionCount, questions]) => {
        if (questionCount < MAX_QUESTIONS_DISPLAYED) {
          return this.triviaService.fetchNextQuestion().pipe(
            map((question: any) => {
              // check if the question was not displayed yet
              if (questions.includes(question)) {
                return TriviaActions.loadNextQuestion();
              }
              return TriviaActions.questionFetchSuccess({ question });
            }),
            catchError((error) => of(TriviaActions.questionFetchFail({ error: error.message })))
          );
        } else {
          return EMPTY;
        }
      })
    )
  );
}
