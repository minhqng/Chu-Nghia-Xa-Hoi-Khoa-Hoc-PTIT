import { describe, expect, it } from "vitest";
import { allQuestions } from "../data/question-bank";
import { createAnswerRecord, createExamSession, formatClock, scoreSession } from "./quiz-engine";
import type { QuizSessionState } from "../types/quiz";

describe("quiz engine", () => {
  it("creates an exam with unique random questions and one minute per question", () => {
    const session = createExamSession(allQuestions, 50);
    const uniqueIds = new Set(session.questionIds);

    expect(session.questionIds).toHaveLength(50);
    expect(uniqueIds.size).toBe(50);
    expect(session.durationSeconds).toBe(3000);
    expect(session.mode).toBe("exam");
  });

  it("scores answered questions without counting blanks as wrong", () => {
    const session: QuizSessionState = {
      mode: "practice",
      questionIds: ["q1", "q2", "q3"],
      currentIndex: 0,
      startedAt: Date.now(),
      answers: {
        q1: createAnswerRecord("a1", true),
        q2: createAnswerRecord("a2", false)
      }
    };

    expect(scoreSession(session)).toMatchObject({
      total: 3,
      answered: 2,
      correct: 1,
      wrong: 1,
      percent: 33
    });
  });

  it("formats clocks with hours only when needed", () => {
    expect(formatClock(65)).toBe("01:05");
    expect(formatClock(3661)).toBe("01:01:01");
    expect(formatClock(-5)).toBe("00:00");
  });
});
