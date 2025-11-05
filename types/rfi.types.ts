// @/types/rfi.types.ts
export interface RfiQuestion {
  id: string;
  question: string;
  responseType?: "TEXT" | "LONG_TEXT" | "NUMBER" | "MULTIPLE_CHOICE" | "YES_NO" | "DATE" | "FILE_UPLOAD" | "RATING"
  options?: string[];
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export enum RfiStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
}

export interface Rfi {
  id: string;
  referenceNumber: string;
  title: string;
  introduction?: string;
  purpose?: string;
  background?: string;
  scopeOfInformation?: string;
  responseFormat?: string;
  issueDate?: string;
  submissionDeadline?: string;
  nextSteps?: string;
  confidentialityNotice?: string;
  attachments?: { name: string; url: string }[];
  remarks?: string;
  status: RfiStatus;
  questions: RfiQuestion[];
  createdAt: string;
  updatedAt: string;
  createdBy?: { id: string; name: string };
}

// DTOs
export interface CreateRfiQuestionDto {
  question: string;
  responseType?: "TEXT" | "LONG_TEXT" | "NUMBER" | "MULTIPLE_CHOICE" | "YES_NO" | "DATE" | "FILE_UPLOAD" | "RATING";
  options?: string[];
  order?: number;
}

export interface CreateRfiDto {
  referenceNumber: string;
  title: string;
  introduction?: string;
  purpose?: string;
  background?: string;
  scopeOfInformation?: string;
  responseFormat?: string;
  issueDate?: string;
  submissionDeadline?: string;
  nextSteps?: string;
  confidentialityNotice?: string;
  attachments?: { name: string; url: string }[];
  remarks?: string;
  status?: RfiStatus;
  questions?: CreateRfiQuestionDto[];
}

export interface UpdateRfiDto extends Partial<CreateRfiDto> {}
