import type { AnswerRecord, NormalizedQuestion, QuizSessionState } from "../types/quiz";

export interface ScoreSummary {
  total: number;
  answered: number;
  correct: number;
  wrong: number;
  percent: number;
}

export function shuffleQuestions<T>(items: T[], random = Math.random): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function createAnswerRecord(answerId: string, isCorrect: boolean): AnswerRecord {
  return { answerId, isCorrect, answeredAt: Date.now() };
}

export function scoreSession(session: QuizSessionState): ScoreSummary {
  const answered = Object.keys(session.answers).length;
  const correct = Object.values(session.answers).filter((answer) => answer.isCorrect).length;
  const total = session.questionIds.length;
  const wrong = answered - correct;
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { total, answered, correct, wrong, percent };
}

export function createPracticeSession(questions: NormalizedQuestion[]): QuizSessionState {
  return {
    mode: "practice",
    questionIds: questions.map((question) => question.id),
    currentIndex: 0,
    answers: {},
    startedAt: Date.now()
  };
}

export function createExamSession(questions: NormalizedQuestion[], count: number): QuizSessionState {
  const selected = shuffleQuestions(questions).slice(0, Math.min(count, questions.length));
  return {
    mode: "exam",
    questionIds: selected.map((question) => question.id),
    currentIndex: 0,
    answers: {},
    startedAt: Date.now(),
    durationSeconds: selected.length * 60
  };
}

export function formatClock(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remaining = safeSeconds % 60;
  const parts = hours > 0 ? [hours, minutes, remaining] : [minutes, remaining];
  return parts.map((part) => String(part).padStart(2, "0")).join(":");
}
