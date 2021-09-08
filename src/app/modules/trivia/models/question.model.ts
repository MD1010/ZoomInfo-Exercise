export interface Question {
  id: string;
  content: string;
  answers: { content: string; isCorrect: boolean }[];
  number: number;
}
