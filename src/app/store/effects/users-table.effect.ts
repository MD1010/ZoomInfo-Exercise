import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Dictionary } from "@ngrx/entity";
import { Action, Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import {
  catchError,
  map,
  startWith,
  switchMap,
  withLatestFrom,
} from "rxjs/operators";
import { PageRequest } from "src/app/models/page-request.model";
import { User } from "src/app/models/user.model";
import { UsersTableService } from "src/app/services/users-table.service";
import { pagedTableConfig } from "src/app/shared/components/table/users-table.config";
import {
  LoadPage,
  loadPageFail,
  loadPageSuccess,
  LOAD_PAGE,
} from "../actions/users-table.action";
import { AppState } from "../app-store";
import {
  getAllEntities,
  getUsersByPage,
} from "./../selectors/user-table.selector";

@Injectable()
export class UsersTableEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private usersTableService: UsersTableService
  ) {}
  @Effect()
  loadUsersToPage$: Observable<Action> = this.actions$.pipe(
    startWith({
      type: LOAD_PAGE,
      payload: pagedTableConfig,
    }),
    ofType(LOAD_PAGE),
    withLatestFrom(
      this.store$.select(getAllEntities),
      this.store$.select(getUsersByPage)
    ),
    switchMap(
      ([action, entities, usersByPage]: [
        LoadPage,
        Dictionary<User>,
        Dictionary<User[]>
      ]) => {
        const request = action.payload;
        const { pageSize, pageNumber } = request;
        let requestedIds: string[] = [];
        const requestedCachedUsers: User[] = [];

        // user navigates to a page he was before
        if (
          this.usersTableService.checkIfPageWasLoadedPreviously(
            usersByPage,
            pageNumber
          )
        ) {
          return of(
            loadPageSuccess({
              content: usersByPage[pageNumber],
              pageSize,
              pageNumber,
            })
          );
        }
        return this.usersTableService.fetchRequestedPageUsersIds(request).pipe(
          switchMap((idsToFetch) => {
            requestedIds = idsToFetch;

            // check which ids are needed to be fetched
            return this.usersTableService.getNewIdsToFetch(
              idsToFetch,
              entities
            );
          }),
          switchMap((newIds) => {
            return this._fetchNewUsersFromAPI(
              requestedIds,
              request,
              newIds,
              entities
            );
          }),
          catchError((err) => of(loadPageFail(err)))
        );
      }
    )
  );
  // helper methods
  private _fetchNewUsersFromAPI(
    requestedIds: string[],
    request: PageRequest<User>,
    newIds: string[],
    entities: Dictionary<User>
  ) {
    const { pageSize, pageNumber } = request;
    const requestedCachedUsers = this.usersTableService.getCachedUsers(
      requestedIds,
      entities
    );
    // if no new ids are found return the cached data and don't make another request
    if (!newIds.length) {
      return of(
        loadPageSuccess({ content: requestedCachedUsers, pageSize, pageNumber })
      );
    }
    return this.usersTableService.fetchUsersData(newIds).pipe(
      map((newUsers: User[]) =>
        loadPageSuccess({
          content: newUsers.concat(requestedCachedUsers),
          pageSize,
          pageNumber,
        })
      )
    );
  }
}
