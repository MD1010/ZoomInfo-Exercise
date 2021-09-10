import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { Carousel } from "primeng/carousel";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { TimerComponent } from "src/app/modules/shared/components/timer/timer.component";
import * as TriviaActions from "src/app/store/actions";
import { AppState } from "src/app/store/app-state";
import { getAllQuestions } from "src/app/store/selectors/trivia.selector";
import { MAX_QUESTIONS_DISPLAYED, NUM_OF_RETRIES, TIME_PER_QUESTION } from "src/app/utils/consts";
import { IAnswer } from "../../interfaces/answer.interface";
import { IQuestion } from "../../interfaces/question.interface";

@Component({
  selector: "app-questions-display",
  templateUrl: "./questions-display.component.html",
  styleUrls: ["./questions-display.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionsDisplayComponent implements OnInit, AfterViewInit {
  constructor(private store: Store<AppState>) {}

  // currentQuestion$: Observable<Question | null>;
  questions$: Observable<IQuestion[] | null>;
  questionCount = 0;
  selectedAnswer: IAnswer | null = null;
  currentQuestionTries = NUM_OF_RETRIES;
  submitedQuestion: IQuestion | null = null;
  correctAnswers = 0;
  @ViewChild("carousel") carousel: Carousel;
  @ViewChild("timer") timer: TimerComponent;
  questionTime = TIME_PER_QUESTION;

  ngOnInit(): void {
    // this.currentQuestion$ = this.store.select(getCurrentQuestion);
    this.questions$ = this.store
      .select(getAllQuestions)
      .pipe(tap((questions) => (this.questionCount = questions.length)));
  }

  ngAfterViewInit(): void {
    this.carousel.isForwardNavDisabled = () => true;
    this.carousel.isBackwardNavDisabled = () => true;
    this.carousel.onTransitionEnd = () => {
      this.onQuestionDisplayed();
    };
    this.onQuestionDisplayed();
  }
  onQuestionDisplayed() {
    this.selectedAnswer = null;
    this.currentQuestionTries = NUM_OF_RETRIES;

    this.getNextQuestion();
  }
  updateSelection(answer: IAnswer | null) {
    this.selectedAnswer = answer;
  }

  checkIfGameOver() {
    if (this.submitedQuestion?.number === MAX_QUESTIONS_DISPLAYED) {
      alert(`Quiz done, You have got ${this.correctAnswers}/${MAX_QUESTIONS_DISPLAYED} correct answers!`);
      this.timer.stopTimer$.next();
      return true;
    }
    return false;
  }

  getNextQuestion() {
    if (this.questionCount !== MAX_QUESTIONS_DISPLAYED) {
      this.store.dispatch(TriviaActions.loadNextQuestion());
    }
  }
  submitAnswer(question: IQuestion) {
    this.submitedQuestion = question;

    const answer = this.selectedAnswer;
    if (!answer) {
      return;
    }
    if (answer.isCorrect) {
      alert("You are right");
      this.correctAnswers += 1;
      this.moveToNextQuestion();
    } else if (this.currentQuestionTries - 1) {
      this.currentQuestionTries -= 1;
      alert("Please Try again");
    } else {
      alert("Maybe next time :(");
      this.moveToNextQuestion();
    }
  }
  moveToNextQuestion() {
    // todo many questions are fetched as the number of timers each question has
    // this.store.dispatch(TriviaActions.loadNextQuestion());
    // todo check if last question display popup
    // todo handle timer ticking after game is done
    // if (!this.selectedAnswer) {
    //   alert("You ran out of time");
    // }
    // console.log("moving to next question");

    if (!this.checkIfGameOver()) {
      this.timer.timerControl$.next();
      this.carousel.navForward(null);
    }
  }
}
