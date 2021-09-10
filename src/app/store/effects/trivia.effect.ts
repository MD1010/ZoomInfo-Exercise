import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { EMPTY, of } from "rxjs";
import { catchError, map, mergeMap, startWith, switchMap } from "rxjs/operators";
import { TriviaService } from "src/app/modules/trivia/services/trivia.service";
import { MAX_QUESTIONS_DISPLAYED } from "src/app/utils/consts";
import * as TriviaActions from "../actions/trivia.actions";
import { AppState } from "../app-state";
import { getFetchedQuestionsCount } from "../selectors";

@Injectable()
export class TriviaEffects {
  constructor(private actions$: Actions, private triviaService: TriviaService, private store$: Store<AppState>) {}
  // todo check if question is not in store
  loadQuestion$ = createEffect(() =>
    this.actions$.pipe(
      startWith(TriviaActions.loadNextQuestion()),
      ofType(TriviaActions.loadNextQuestion),
      concatLatestFrom(() => this.store$.select(getFetchedQuestionsCount)),
      mergeMap(([_, questionCount]) => {
        if (questionCount !== MAX_QUESTIONS_DISPLAYED) {
          return this.triviaService.fetchNextQuestion().pipe(
            map((question: any) => TriviaActions.questionFetchSuccess({ question })),
            catchError((error) => of(TriviaActions.questionFetchFail({ error: error.message })))
          );
        } else {
          return EMPTY;
        }
      })
    )
  );
}
