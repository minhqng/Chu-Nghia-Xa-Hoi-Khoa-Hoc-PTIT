import { describe, expect, it } from "vitest";
import { allQuestions, getQuestionsForScope, questionSources } from "./question-bank";

function sourceTotal(sourceId: "question-bank" | "theory-review"): number {
  return getQuestionsForScope(sourceId, "all").length;
}

function formatQuestionTotal(total: number): string {
  return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

describe("question bank normalization", () => {
  it("loads both sources and all validated questions", () => {
    const normalizedTotal = questionSources.reduce(
      (sum, source) => sum + source.chapters.reduce((chapterSum, chapter) => chapterSum + chapter.questions.length, 0),
      0
    );

    expect(questionSources).toHaveLength(2);
    expect(allQuestions).toHaveLength(normalizedTotal);
  });

  it("keeps source and chapter scopes selectable", () => {
    const bankSource = questionSources.find((source) => source.id === "question-bank");
    const theoryChapter06 = questionSources
      .find((source) => source.id === "theory-review")
      ?.chapters.find((chapter) => chapter.id === "06");
    const theoryChapter06Length = theoryChapter06?.questions.length ?? 0;

    expect(getQuestionsForScope("question-bank", "all")).toHaveLength(sourceTotal("question-bank"));
    expect(theoryChapter06Length).toBeGreaterThan(0);
    expect(getQuestionsForScope("theory-review", "06")).toHaveLength(theoryChapter06Length);
    expect(bankSource?.description).toContain(formatQuestionTotal(sourceTotal("question-bank")));
  });

  it("keeps source descriptions in sync with imported question counts", () => {
    const theoryTotal = sourceTotal("theory-review");
    const theorySource = questionSources.find((source) => source.id === "theory-review");

    expect(theorySource?.description).toContain(formatQuestionTotal(theoryTotal));
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
