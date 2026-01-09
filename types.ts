export enum AppView {
  HOME = 'HOME',
  INTERVIEW_PREP = 'INTERVIEW_PREP',
  RESUME_REVIEW = 'RESUME_REVIEW',
  CHAT = 'CHAT',
  MENTOR_COMMUNITY = 'MENTOR_COMMUNITY',
  EXAM_TERMINAL = 'EXAM_TERMINAL',
  BLACK_BOX = 'BLACK_BOX',
}

export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: number;
}

export interface InterviewSuggestion {
  style: string;
  response: string;
  crmFocus: string; // Explanation of CRM skills used
}

export interface ResumeReviewResult {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}

export interface ImageUpload {
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}