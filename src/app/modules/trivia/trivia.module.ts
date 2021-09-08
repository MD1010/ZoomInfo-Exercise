import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { HttpClientModule } from "@angular/common/http";
import { StoreModule } from "@ngrx/store";
import { QuestionComponent } from "./components/question/question.component";
import { QuestionsDisplayComponent } from "./components/questions-display/questions-display.component";
import { effects } from "src/app/store/effects";
import { EffectsModule } from "@ngrx/effects";
import * as fromTrivia from "src/app/store/reducers";

@NgModule({
  declarations: [QuestionComponent, QuestionsDisplayComponent],
  exports: [QuestionComponent, QuestionsDisplayComponent],
  imports: [
    SharedModule,
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature("trivia", fromTrivia.reducer),
    EffectsModule.forFeature(effects),
  ],
})
export class TriviaModule {}
