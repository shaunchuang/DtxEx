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

export interface QuestionnaireAttributes {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SectionAttributes {
  id: string;
  formId: string;
  title?: string;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionAttributes {
  id: string;
  sectionId: string;
  questionText: string;
  questionType: QuestionType;
  order: number;
  isRequired?: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionOptionAttributes {
  id: string;
  questionId: string;
  optionText: string;
  optionValue?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResponseAttributes {
  id: string;
  formId: string;
  userId: string;
  submitTime: Date;
  lastUpdateTime?: Date;
  status: ResponseStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnswerAttributes {
  id: string;
  responseId: string;
  questionId: string;
  answerText?: string;
  answerDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnswerOptionAttributes {
  id: string;
  answerId: string;
  optionId: string;
  createdAt: Date;
  updatedAt: Date;
}
