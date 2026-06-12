import type { NormalizedQuestion, QuizMode, QuizSessionState } from "../types/quiz";

export type PaletteStatus = "empty" | "current" | "correct" | "wrong" | "selected";

export function getPaletteStatus(
  question: NormalizedQuestion,
  session: QuizSessionState,
  index: number,
  submitted: boolean
): PaletteStatus {
  if (index === session.currentIndex) return "current";
  const answer = session.answers[question.id];
  if (!answer) return "empty";
  if (session.mode === "exam" && !submitted) return "selected";
  return answer.isCorrect ? "correct" : "wrong";
}

export function shouldRevealAnswer(mode: QuizMode, submitted: boolean, hasAnswer: boolean): boolean {
  return mode === "practice" ? hasAnswer : submitted;
}
