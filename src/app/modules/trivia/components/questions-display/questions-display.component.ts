import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { Carousel } from "primeng/carousel";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";
import { TimerComponent } from "src/app/modules/shared/components/timer/timer.component";
import * as TriviaActions from "src/app/store/actions";
import { AppState } from "src/app/store/app-state";
import { getAllQuestions, getCorrectAnswersCount, getGameState, getTriviaError } from "src/app/store/selectors";
import {
  COLORS,
  GAME_MESSAGES,
  MAX_QUESTIONS_DISPLAYED,
  NUM_OF_RETRIES,
  TIME_PER_QUESTION,
} from "src/app/utils/consts";
import { IAnswer, IQuestion } from "../../interfaces";

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

  selectedAnswer: IAnswer | null = null;
  submitedQuestion: IQuestion | null = null;
  questionTime = TIME_PER_QUESTION;
  currentQuestionTriesLeft: number;

  @ViewChild("carousel") carousel: Carousel;
  @ViewChild("timer") timer: TimerComponent;

  async ngOnInit() {
    this.questions$ = this.store.select(getAllQuestions);
    this.isGameOver$ = this.store.select(getGameState);
    this.numOfCorrectAnswers$ = this.store.select(getCorrectAnswersCount).pipe(take(1));
    this.error$ = this.store.select(getTriviaError);
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
    this.currentQuestionTriesLeft -= 1;
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
    this.currentQuestionTriesLeft = NUM_OF_RETRIES;
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

  submitAnswer(question: IQuestion) {
    this.submitedQuestion = question;
    const answer = this.selectedAnswer;
    if (!answer) {
      return;
    }
    if (answer.isCorrect) {
      this.handleCorrectAnswer();
    } else if (this.currentQuestionTriesLeft - 1) {
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
