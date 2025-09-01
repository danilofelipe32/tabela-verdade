
export enum AnswerState {
  V = 'V',
  F = 'F',
  EMPTY = '',
}

export interface Level {
  id: number;
  title: string;
  description: string;
  expression: string;
  variables: string[];
  solution: boolean[];
}

export enum CheckState {
    UNCHECKED,
    CORRECT,
    INCORRECT,
}
