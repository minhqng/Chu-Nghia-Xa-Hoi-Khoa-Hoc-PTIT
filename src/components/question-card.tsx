import { CheckCircle2, XCircle } from "lucide-react";
import { shouldRevealAnswer } from "../lib/answer-view";
import type { AnswerRecord, NormalizedQuestion, QuizMode } from "../types/quiz";

interface QuestionCardProps {
  question: NormalizedQuestion;
  number: number;
  total: number;
  mode: QuizMode;
  answer?: AnswerRecord;
  submitted: boolean;
  onAnswer: (answerId: string, isCorrect: boolean) => void;
}

export function QuestionCard({
  question,
  number,
  total,
  mode,
  answer,
  submitted,
  onAnswer
}: QuestionCardProps) {
  const hasAnswer = Boolean(answer);
  const reveal = shouldRevealAnswer(mode, submitted, hasAnswer);
  const correctAnswer = question.answers.find((option) => option.isCorrect);
  const locked = (mode === "practice" && hasAnswer) || submitted;

  return (
    <article className="question-card">
      <div className="question-meta">
        <span>{question.sourceLabel}</span>
        <span>{question.chapterTitle}</span>
        <span>Câu {number}/{total}</span>
      </div>
      <h2>{question.prompt}</h2>
      <div className="answer-list">
        {question.answers.map((option, index) => {
          const selected = answer?.answerId === option.id;
          const state = reveal && option.isCorrect ? "correct" : reveal && selected ? "wrong" : "";

          return (
            <button
              key={option.id}
              className={`answer-button ${selected ? "selected" : ""} ${state}`}
              disabled={locked}
              onClick={() => onAnswer(option.id, option.isCorrect)}
            >
              <span className="answer-index">{String.fromCharCode(65 + index)}</span>
              <span>{option.text}</span>
            </button>
          );
        })}
      </div>
      {reveal && (
        <section className={answer?.isCorrect ? "explanation correct" : "explanation wrong"}>
          <div className="explanation-title">
            {answer?.isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            <strong>{answer?.isCorrect ? "Đúng rồi" : "Cần nhớ keyword"}</strong>
          </div>
          <p><b>Keyword:</b> {correctAnswer?.text}</p>
          <p>{question.explanation}</p>
        </section>
      )}
    </article>
  );
}
