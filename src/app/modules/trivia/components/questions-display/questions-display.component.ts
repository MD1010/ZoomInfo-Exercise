import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { Carousel } from "primeng/carousel";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";
import { TimerComponent } from "src/app/modules/shared/components/timer/timer.component";
import * as TriviaActions from "src/app/store/actions";
import { AppState } from "src/app/store/app-state";
import {
  getAllQuestions,
  getCorrectAnswersCount,
  getGameState,
  getTriviaError,
} from "src/app/store/selectors/trivia.selector";
import { GAME_MESSAGES, MAX_QUESTIONS_DISPLAYED, NUM_OF_RETRIES, TIME_PER_QUESTION } from "src/app/utils/consts";
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

  selectedAnswer: IAnswer | null = null;
  currentQuestionTries = NUM_OF_RETRIES; // todo move to store
  submitedQuestion: IQuestion | null = null; // todo current question displayed can be moved to store
  questionTime = TIME_PER_QUESTION;

  @ViewChild("carousel") carousel: Carousel;
  @ViewChild("timer") timer: TimerComponent;

  ngOnInit(): void {
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
    this.currentQuestionTries = NUM_OF_RETRIES;
    this.getNextQuestion();
  }
  updateSelection(answer: IAnswer | null) {
    this.selectedAnswer = answer;
  }

  checkIfGameOver() {
    if (this.carousel.page === MAX_QUESTIONS_DISPLAYED - 1) {
      this.endQuiz();
      return true;
    }
    return false;
  }

  getNextQuestion() {
    this.store.dispatch(TriviaActions.loadNextQuestion());
  }
  submitAnswer(question: IQuestion) {
    this.submitedQuestion = question; // todo get from store

    const answer = this.selectedAnswer;
    if (!answer) {
      return;
    }
    if (answer.isCorrect) {
      this.colorLastQuestionIndicator(true);
      alert(GAME_MESSAGES.CORRECT_ANSWER);
      this.store.dispatch(TriviaActions.increaseCorrectAnswersCount());
      this.moveToNextQuestion();
    } else if (this.currentQuestionTries - 1) {
      this.currentQuestionTries -= 1;
      alert(GAME_MESSAGES.WRONG_ANSWER);
    } else {
      const correctAnswer = this.submitedQuestion.answers.find((ans) => !!ans.isCorrect)?.content;
      alert(`${GAME_MESSAGES.FAILED_ETTEMPT} ${correctAnswer}`);
      this.colorLastQuestionIndicator(false);
      this.moveToNextQuestion();
    }
  }
  moveToNextQuestion() {
    if (!this.checkIfGameOver()) {
      this.timer.timerControl$.next();
      this.carousel.navForward(null);
      this.onQuestionDisplayed();
    }
  }

  colorLastQuestionIndicator(isLastQuestionCorrect: boolean) {
    const currentQuestionNumber = this.submitedQuestion?.number;
    if (currentQuestionNumber) {
      ((document.querySelector(".p-carousel-indicators")?.childNodes[currentQuestionNumber - 1] as HTMLElement)
        .children[0] as HTMLElement).style.background = isLastQuestionCorrect ? "#4BB543" : "#FC100D";
    }
  }

  async endQuiz() {
    this.store.dispatch(TriviaActions.quizOver());
    const correctAnswers = await this.numOfCorrectAnswers$.toPromise();
    console.log(correctAnswers);

    alert(`Quiz done, You have got ${correctAnswers}/${MAX_QUESTIONS_DISPLAYED} correct answers!`);
    this.timer.stopTimer$.next();
  }
}
