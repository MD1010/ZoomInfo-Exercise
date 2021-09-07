import { Component, OnInit } from "@angular/core";
import { Dictionary } from "@ngrx/entity";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { PageRequest } from "src/app/models/page-request.model";
import { User } from "src/app/models/user.model";
import { loadPage } from "src/app/store/actions";
import { AppState } from "src/app/store/app-store";
import {
  getAllUsers,
  getFetchPageError,
  getIsUsersPageLoading,
  getUsersByPage,
} from "src/app/store/selectors";

@Component({
  selector: "app-users",
  templateUrl: "./users-data.component.html",
})
export class UsersDataComponent implements OnInit {
  users$: Observable<User[]>;
  usersByPage$: Observable<Dictionary<User[]>>;
  isLoading$: Observable<boolean>;
  fetchError$: Observable<string>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.users$ = this.store.select(getAllUsers);
    this.usersByPage$ = this.store.select(getUsersByPage);
    this.isLoading$ = this.store.select(getIsUsersPageLoading);
    this.fetchError$ = this.store.select(getFetchPageError);
  }

  getPage(request: PageRequest<User>) {
    this.store.dispatch(loadPage(request));
  }
}
