export enum QuestionType {
  TEXT = 'TEXT',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SCALE = 'SCALE',
  PARAGRAPH = 'PARAGRAPH',
  DATE = 'DATE'
}

export enum ResponseStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  COMPLETED = 'COMPLETED'
}

export interface Questionnaire {
  id: string;
  title: string;
  description?: string;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  formId: string;
  title?: string;
  description?: string;
  order: number;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  sectionId: string;
  questionText: string;
  questionType: QuestionType;
  order: number;
  isRequired?: boolean;
  description?: string;
  options: QuestionOption[];
  createdAt: string;
  updatedAt: string;
}

export interface QuestionOption {
  id: string;
  questionId: string;
  optionText: string;
  optionValue?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Response {
  id: string;
  formId: string;
  userId: string;
  submitTime: string;
  lastUpdateTime?: string;
  status: ResponseStatus;
  questionnaire: Questionnaire;
  user: User;
  answers: Answer[];
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  id: string;
  responseId: string;
  questionId: string;
  answerText?: string;
  answerDate?: string;
  question: Question;
  selectedOptions: AnswerOption[];
  createdAt: string;
  updatedAt: string;
}

export interface AnswerOption {
  id: string;
  answerId: string;
  optionId: string;
  option: QuestionOption;
  createdAt: string;
  updatedAt: string;
}

// 表單提交用的介面
export interface SubmitAnswerData {
  questionId: string;
  answerText?: string;
  answerDate?: string;
  selectedOptions?: string[];
}

export interface SubmitResponseData {
  formId: string;
  userId: string;
  answers: SubmitAnswerData[];
}

// API 回應介面
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
