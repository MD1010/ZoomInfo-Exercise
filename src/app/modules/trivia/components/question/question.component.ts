import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { IAnswer } from "../../interfaces";
import { IQuestion } from "../../interfaces";

@Component({
  selector: "app-question",
  templateUrl: "./question.component.html",
  styleUrls: ["./question.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionComponent implements OnInit {
  constructor() {}

  @Input() question: IQuestion;
  @Input() index: number;
  @Output() answerSelected = new EventEmitter<IAnswer | null>();
  selectedAnswer: IAnswer;

  ngOnInit(): void {}

  onSelect(answer: IAnswer) {
    this.selectedAnswer = answer;
    this.answerSelected.emit(answer);
  }
}
