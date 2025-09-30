export type QuestionPer = "ticket" | "order";

export type QuestionType =
  | "shortText"
  | "longText"
  | "dropdown"
  | "checkboxes"
  | "checkbox"
  | "waiver";

export type QuestionAppliesTo = "all" | string[];

export interface Question {
  _id?: string;
  per: QuestionPer;
  type: QuestionType;
  required: boolean;
  labelTitle: string;
  text?: string;
  options?: string[];
  appliesTo: QuestionAppliesTo;
  isImmutable: boolean;
  isVisible: boolean;
}
