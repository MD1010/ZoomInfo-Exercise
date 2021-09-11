import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { Carousel } from "primeng/carousel";
import { Observable } from "rxjs";
import { last, take } from "rxjs/operators";
import { TimerComponent } from "src/app/modules/shared/components/timer/timer.component";
import * as TriviaActions from "src/app/store/actions";
import { resetNumberOfTries } from "src/app/store/actions";
import { AppState } from "src/app/store/app-state";
import {
  getAllQuestions,
  getCorrectAnswersCount,
  getCurrentQuestionTriesLeft,
  getGameState,
  getTriviaError,
} from "src/app/store/selectors/trivia.selector";
import { COLORS, GAME_MESSAGES, MAX_QUESTIONS_DISPLAYED, TIME_PER_QUESTION } from "src/app/utils/consts";
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

  questions$: Observable<IQuestion[] | null>;
  isGameOver$: Observable<boolean>;
  numOfCorrectAnswers$: Observable<number>;
  error$: Observable<string | null>;
  currentQuestionTriesLeft$: Observable<number>;

  selectedAnswer: IAnswer | null = null;
  submitedQuestion: IQuestion | null = null;
  questionTime = TIME_PER_QUESTION;

  @ViewChild("carousel") carousel: Carousel;
  @ViewChild("timer") timer: TimerComponent;

  async ngOnInit() {
    this.questions$ = this.store.select(getAllQuestions);
    this.isGameOver$ = this.store.select(getGameState);
    this.numOfCorrectAnswers$ = this.store.select(getCorrectAnswersCount).pipe(take(1));
    this.error$ = this.store.select(getTriviaError);
    this.currentQuestionTriesLeft$ = this.store.select(getCurrentQuestionTriesLeft).pipe(take(1));
  }

  ngAfterViewInit(): void {
    this.carousel.isForwardNavDisabled = () => true;
    this.carousel.isBackwardNavDisabled = () => true;
    this.onQuestionDisplayed();
  }
  onQuestionDisplayed() {
    this.selectedAnswer = null;
    this.resetQuestionTries();
    this.getNextQuestion();
  }

  getNextQuestion() {
    this.store.dispatch(TriviaActions.loadNextQuestion());
  }

  handleWrongAnswer() {
    this.store.dispatch(TriviaActions.decreaseNumberOfTries());
    alert(GAME_MESSAGES.WRONG_ANSWER);
  }

  handleCorrectAnswer() {
    this.colorLastQuestionIndicator(true);
    alert(GAME_MESSAGES.CORRECT_ANSWER);
    this.store.dispatch(TriviaActions.increaseCorrectAnswersCount());
    this.moveToNextQuestion();
  }

  handleOutOfTries() {
    const correctAnswer = this.submitedQuestion?.answers.find((ans) => !!ans.isCorrect)?.content;
    alert(`${GAME_MESSAGES.FAILED_ETTEMPT} ${correctAnswer}`);
    this.colorLastQuestionIndicator(false);
    this.moveToNextQuestion();
  }

  updateSelection(answer: IAnswer | null) {
    this.selectedAnswer = answer;
  }

  resetQuestionTries() {
    this.store.dispatch(resetNumberOfTries());
  }

  async endQuiz() {
    this.store.dispatch(TriviaActions.quizOver());
    const correctAnswers = await this.numOfCorrectAnswers$.toPromise();
    alert(`Quiz done, You have got ${correctAnswers}/${MAX_QUESTIONS_DISPLAYED} correct answers!`);
    this.timer.stopTimer$.next();
  }

  checkIfGameOver() {
    if (this.carousel.page === MAX_QUESTIONS_DISPLAYED - 1) {
      this.endQuiz();
      return true;
    }
    return false;
  }

  colorLastQuestionIndicator(isLastQuestionCorrect: boolean) {
    const currentQuestionNumber = this.submitedQuestion?.number;
    if (currentQuestionNumber) {
      ((document.querySelector(".p-carousel-indicators")?.childNodes[currentQuestionNumber - 1] as HTMLElement)
        .children[0] as HTMLElement).style.background = isLastQuestionCorrect ? COLORS.SUCCESS : COLORS.FAIL;
    }
  }

  async submitAnswer(question: IQuestion) {
    this.submitedQuestion = question;
    const triesLeft = await this.currentQuestionTriesLeft$.toPromise();
    const answer = this.selectedAnswer;
    if (!answer) {
      return;
    }
    if (answer.isCorrect) {
      this.handleCorrectAnswer();
    } else if (triesLeft - 1) {
      this.handleWrongAnswer();
    } else {
      this.handleOutOfTries();
    }
  }

  moveToNextQuestion() {
    if (!this.checkIfGameOver()) {
      this.timer.timerControl$.next();
      this.carousel.navForward(null);
      this.onQuestionDisplayed();
    }
  }
}
