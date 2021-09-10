import { IAnswer } from "./answer.interface";

export interface IQuestion {
  id: string;
  content: string;
  answers: IAnswer[];
  number: number;
}
