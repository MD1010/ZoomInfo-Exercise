import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { uniq, uniqueId } from "lodash";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { HttpService } from "../../core/services/http.service";
import { Question } from "../models/question.model";
import { v4 as uuidv4 } from "uuid";

@Injectable({
  providedIn: "root",
})
export class TriviaService {
  constructor(private http: HttpService) {}

  private _normalizeQuestion(apiQuestion: any): Question {
    const incorrectAnswers = apiQuestion.incorrect_answers.map((a: any) => ({ content: a, isCorrect: false }));
    const correctAnswer = { content: apiQuestion.correct_answer, isCorrect: true };
    return {
      answers: [...incorrectAnswers, correctAnswer],
      content: apiQuestion.question,
      id: uuidv4(),
    };
  }
  fetchNextQuestion(): Observable<Question> {
    return this.http.get(environment.apiEndpoint, new HttpParams({ fromObject: { amount: 1, type: "multiple" } })).pipe(
      map((res: any) => {
        const [question] = res.results;
        return this._normalizeQuestion(question);
      })
    );
  }
}
