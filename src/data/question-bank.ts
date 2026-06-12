import { rawSources } from "./raw-question-banks";
import type { NormalizedQuestion, QuestionSource, RawQuestion, SourceId } from "../types/quiz";

const SOURCE_PREFIX: Record<SourceId, string> = {
  "question-bank": "bank",
  "theory-review": "theory"
};

function normalizeQuestion(
  raw: RawQuestion,
  sourceId: SourceId,
  sourceLabel: string,
  chapterId: string,
  chapterTitle: string,
  index: number
): NormalizedQuestion {
  const id = `${SOURCE_PREFIX[sourceId]}-${chapterId}-${index + 1}`;
  const prompt = raw.question_text.trim() || raw.name.replace(/^Câu hỏi\s*\d+:\s*/i, "").trim();

  return {
    id,
    sourceId,
    sourceLabel,
    chapterId,
    chapterTitle,
    index: index + 1,
    prompt,
    explanation: raw.general_comment.trim(),
    answers: raw.answers.map((answer, answerIndex) => ({
      id: `${id}-a${answerIndex + 1}`,
      text: answer.text.trim(),
      isCorrect: Number(answer.weight) > 0
    }))
  };
}

export const questionSources: QuestionSource[] = rawSources.map((source) => ({
  ...source,
  chapters: source.chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    questions: chapter.questions.map((question, index) =>
      normalizeQuestion(question, source.id, source.label, chapter.id, chapter.title, index)
    )
  }))
}));

export const allQuestions = questionSources.flatMap((source) =>
  source.chapters.flatMap((chapter) => chapter.questions)
);

export const questionMap = new Map(allQuestions.map((question) => [question.id, question]));

export function getQuestionsForScope(sourceId: SourceId, chapterId: string): NormalizedQuestion[] {
  const source = questionSources.find((item) => item.id === sourceId);
  if (!source) return [];
  if (chapterId === "all") return source.chapters.flatMap((chapter) => chapter.questions);
  return source.chapters.find((chapter) => chapter.id === chapterId)?.questions ?? [];
}

export function getQuestionById(id: string): NormalizedQuestion {
  const question = questionMap.get(id);
  if (!question) throw new Error(`Question not found: ${id}`);
  return question;
}
