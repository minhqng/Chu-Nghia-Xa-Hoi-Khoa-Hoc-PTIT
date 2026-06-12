export type SourceId = "question-bank" | "theory-review";
export type QuizMode = "practice" | "exam";

export interface RawAnswer {
  text: string;
  weight: number;
}

export interface RawQuestion {
  question_type: string;
  name: string;
  points_possible: number;
  question_text: string;
  general_comment: string;
  answers: RawAnswer[];
}

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface NormalizedQuestion {
  id: string;
  sourceId: SourceId;
  sourceLabel: string;
  chapterId: string;
  chapterTitle: string;
  index: number;
  prompt: string;
  explanation: string;
  answers: AnswerOption[];
}

export interface ChapterGroup {
  id: string;
  title: string;
  questions: NormalizedQuestion[];
}

export interface QuestionSource {
  id: SourceId;
  label: string;
  folder: string;
  description: string;
  chapters: ChapterGroup[];
}

export interface AnswerRecord {
  answerId: string;
  isCorrect: boolean;
  answeredAt: number;
}

export interface QuizSessionState {
  mode: QuizMode;
  questionIds: string[];
  currentIndex: number;
  answers: Record<string, AnswerRecord>;
  startedAt: number;
  submittedAt?: number;
  durationSeconds?: number;
}

export interface StudySettings {
  autoNext: boolean;
  paletteOpen: boolean;
  mode: QuizMode;
  sourceId: SourceId;
  chapterId: string;
}
