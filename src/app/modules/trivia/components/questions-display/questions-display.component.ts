import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Store } from "@ngrx/store";
import { tap } from "rxjs/operators";
import { AppState } from "src/app/store/app-state";
import { TriviaState } from "src/app/store/reducers";
import { getCurrentQuestion } from "src/app/store/selectors/trivia.selector";
import { TriviaService } from "../../services/trivia.service";
import * as TriviaActions from "src/app/store/actions/index";
import { Observable } from "rxjs";
import { Question } from "../../models/question.model";

@Component({
  selector: "app-questions-display",
  templateUrl: "./questions-display.component.html",
  styleUrls: ["./questions-display.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionsDisplayComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  currentQuestion$: Observable<Question | null>;

  ngOnInit(): void {
    this.currentQuestion$ = this.store.select(getCurrentQuestion);
  }

  switchQuestion() {
    this.store.dispatch(TriviaActions.loadNextQuestion());
  }
}
