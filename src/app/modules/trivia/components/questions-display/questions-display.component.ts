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

  questions$: Observable<IQuestion[] | null>;
  selectedAnswer: IAnswer | null = null;
  currentQuestionTries = NUM_OF_RETRIES;
  submitedQuestion: IQuestion | null = null;
  correctAnswers = 0;
  @ViewChild("carousel") carousel: Carousel;
  @ViewChild("timer") timer: TimerComponent;
  questionTime = TIME_PER_QUESTION;

  ngOnInit(): void {
    this.questions$ = this.store.select(getAllQuestions);
    // this.getNextQuestion();
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
    console.log(123123);

    this.getNextQuestion();
  }
  updateSelection(answer: IAnswer | null) {
    console.log(answer);

    this.selectedAnswer = answer;
  }

  checkIfGameOver() {
    if (this.submitedQuestion?.number === MAX_QUESTIONS_DISPLAYED) {
      alert(`Quiz done, You have got ${this.correctAnswers}/${MAX_QUESTIONS_DISPLAYED} correct answers!`);
      this.timer.stopTimer$.next();
      window.close();
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
      alert("You are right");
      this.correctAnswers += 1;
      this.moveToNextQuestion();
    } else if (this.currentQuestionTries - 1) {
      this.currentQuestionTries -= 1;
      alert("Please Try again");
    } else {
      const correctAnswer = this.submitedQuestion.answers.find((ans) => !!ans.isCorrect)?.content;
      alert(`Maybe next time :( the correct answer is ${correctAnswer}`);
      this.colorLastQuestionIndicator(false);
      this.moveToNextQuestion();
    }
  }
  moveToNextQuestion() {
    if (!this.checkIfGameOver()) {
      this.timer.timerControl$.next();
      this.carousel.navForward(null);
    }
  }

  colorLastQuestionIndicator(isLastQuestionCorrect: boolean) {
    const currentQuestionNumber = this.submitedQuestion?.number;
    if (currentQuestionNumber) {
      ((document.querySelector(".p-carousel-indicators")?.childNodes[currentQuestionNumber - 1] as HTMLElement)
        .children[0] as HTMLElement).style.background = isLastQuestionCorrect ? "#4BB543" : "#FC100D";
    }
  }
}
