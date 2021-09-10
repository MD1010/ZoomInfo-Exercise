import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, mergeMap, startWith } from "rxjs/operators";
import { TriviaService } from "src/app/modules/trivia/services/trivia.service";
import * as TriviaActions from "../actions/trivia.actions";
import { AppState } from "../app-state";

@Injectable()
export class TriviaEffects {
  constructor(private actions$: Actions, private triviaService: TriviaService) {}
  // todo check if question is not in store
  loadQuestion$ = createEffect(() =>
    this.actions$.pipe(
      startWith(TriviaActions.loadNextQuestion()),
      ofType(TriviaActions.loadNextQuestion),
      mergeMap(() =>
        this.triviaService.fetchNextQuestion().pipe(
          map((question: any) => TriviaActions.questionFetchSuccess({ question })),
          catchError((error) => of(TriviaActions.questionFetchFail({ error: error.message })))
        )
      )
    )
  );
}
