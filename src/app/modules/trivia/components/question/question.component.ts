import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { Observable } from "rxjs";
import { Question } from "../../models/question.model";

@Component({
  selector: "app-question",
  templateUrl: "./question.component.html",
  styleUrls: ["./question.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionComponent implements OnInit {
  constructor() {}

  @Input() question: Question;
  @Input() index: number;
  @Output() questionTimeExpired = new EventEmitter<string>();

  ngOnInit(): void {}
  timeExpired() {
    // this.isTimeExpired = true;
    this.questionTimeExpired.emit(this.question.id);
  }
}
