import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { TriviaService } from "src/app/modules/trivia/services/trivia.service";
import * as TriviaActions from "../actions/trivia.actions";
import { AppState } from "../app-store";

@Injectable()
export class TriviaEffects {
  constructor(private actions$: Actions, private store$: Store<AppState>, private triviaService: TriviaService) {}
  loadQuestion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TriviaActions.loadNextQuestion),
      mergeMap(() =>
        this.triviaService.fetchNextQuestion().pipe(
          map((question: any) => TriviaActions.questionFetchSuccess({ question })),
          catchError((error) => of(TriviaActions.questionFetchFail({ error })))
        )
      )
    )
  );
}
