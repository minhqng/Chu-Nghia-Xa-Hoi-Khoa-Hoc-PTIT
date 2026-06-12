import { describe, expect, it } from "vitest";
import { allQuestions, getQuestionsForScope, questionSources } from "./question-bank";

describe("question bank normalization", () => {
  it("loads both sources and all validated questions", () => {
    expect(questionSources).toHaveLength(2);
    expect(allQuestions).toHaveLength(1804);
  });

  it("keeps source and chapter scopes selectable", () => {
    expect(getQuestionsForScope("question-bank", "all")).toHaveLength(560);
    expect(getQuestionsForScope("theory-review", "06")).toHaveLength(243);
  });

  it("normalizes every question with one correct answer and stable ids", () => {
    const ids = new Set(allQuestions.map((question) => question.id));

    expect(ids.size).toBe(allQuestions.length);
    for (const question of allQuestions) {
      expect(question.prompt.trim()).not.toBe("");
      expect(question.answers.filter((answer) => answer.isCorrect)).toHaveLength(1);
      expect([2, 4]).toContain(question.answers.length);
    }
  });

  it("includes repaired malformed source items", () => {
    const repaired = allQuestions.find((question) => question.id === "bank-02-13");

    expect(repaired?.prompt).toContain("phục vụ máy móc");
    expect(repaired?.answers.find((answer) => answer.isCorrect)?.text).toBe("Giai cấp công nhân hiện đại");
  });
});
