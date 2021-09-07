import { Injectable } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AppState } from "../app-store";

@Injectable()
export class UsersTableEffects {
  constructor(private actions$: Actions, private store$: Store<AppState>) {}
}
