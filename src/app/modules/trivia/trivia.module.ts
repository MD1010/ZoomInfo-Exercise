import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { HttpClientModule } from "@angular/common/http";
import { StoreModule } from "@ngrx/store";
import { reducers } from "src/app/store/app-store";
import { QuestionComponent } from "./components/question/question.component";

@NgModule({
  declarations: [QuestionComponent],
  exports: [QuestionComponent],
  imports: [
    SharedModule,
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature("trivia", reducers),
    // EffectsModule.forFeature(effects),
  ],
})
export class TriviaModule {}
