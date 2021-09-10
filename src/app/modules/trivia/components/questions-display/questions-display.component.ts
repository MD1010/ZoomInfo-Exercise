import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { Carousel } from "primeng/carousel";
import { BehaviorSubject, Observable } from "rxjs";
import { share, tap } from "rxjs/operators";
import { AppState } from "src/app/store/app-state";
import { getAllQuestions } from "src/app/store/selectors/trivia.selector";
import { Question } from "../../models/question.model";
import * as TriviaActions from "src/app/store/actions";
import { MAX_QUESTIONS_DISPLAYED } from "src/app/utils/consts";

@Component({
  selector: "app-questions-display",
  templateUrl: "./questions-display.component.html",
  styleUrls: ["./questions-display.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionsDisplayComponent implements OnInit, AfterViewInit {
  constructor(private store: Store<AppState>) {}

  // currentQuestion$: Observable<Question | null>;
  questions$: Observable<Question[] | null>;
  questionCount = 0;
  isGameOver = false;
  @ViewChild("carousel") carousel: Carousel;

  ngOnInit(): void {
    // this.currentQuestion$ = this.store.select(getCurrentQuestion);
    this.questions$ = this.store
      .select(getAllQuestions)
      .pipe(tap((questions) => (this.questionCount = questions.length)));
  }

  ngAfterViewInit(): void {
    this.carousel.isForwardNavDisabled = () => true;
    this.carousel.isBackwardNavDisabled = () => true;
  }
  onQuestionDisplayed() {
    // fetch the next question
    // this.store.dispatch(TriviaActions.loadNextQuestion());
    console.log("started!");
    if (this.questionCount < MAX_QUESTIONS_DISPLAYED) {
      this.store.dispatch(TriviaActions.loadNextQuestion());
    } else {
      this.isGameOver = true;
    }
    // this.questions$
    //   .pipe(
    //     share(),
    //     tap((questions) => {
    //       if (questions?.length !== MAX_QUESTIONS_DISPLAYED) {
    //         this.store.dispatch(TriviaActions.loadNextQuestion());
    //       }
    //     })
    //   )
    //   .subscribe();
  }
  timeExpired() {
    // todo mark this question as incorrect
    // todo many questions are fetched as the number of timers each question has
    // this.store.dispatch(TriviaActions.loadNextQuestion());
    // todo check if last question display popup
    // todo handle timer ticking after game is done
    console.log(this.carousel.page);

    if (this.carousel.page === MAX_QUESTIONS_DISPLAYED - 1) {
      alert("Quiz done!");
    }
    this.carousel.navForward(null);
  }
}
