import { RotateCcw } from "lucide-react";
import type { NormalizedQuestion, QuizSessionState } from "../types/quiz";
import { scoreSession } from "../lib/quiz-engine";

interface ResultsViewProps {
  questions: NormalizedQuestion[];
  session: QuizSessionState;
  onRestart: () => void;
}

export function ResultsView({ questions, session, onRestart }: ResultsViewProps) {
  const score = scoreSession(session);

  return (
    <section className="results-view">
      <div className="result-hero">
        <p className="eyebrow">Kết quả thi thử</p>
        <h2>{score.correct}/{score.total} câu đúng</h2>
        <div className="result-metrics">
          <span>{score.percent}%</span>
          <span>Đúng {score.correct}</span>
          <span>Sai {score.wrong}</span>
          <span>Đã làm {score.answered}</span>
        </div>
        <button className="primary-action" onClick={onRestart}>
          <RotateCcw size={18} />
          Tạo đề mới
        </button>
      </div>
      <div className="review-list">
        {questions.map((question, index) => {
          const answer = session.answers[question.id];
          const chosen = question.answers.find((option) => option.id === answer?.answerId);
          const correct = question.answers.find((option) => option.isCorrect);

          return (
            <article key={question.id} className={answer?.isCorrect ? "review-item correct" : "review-item wrong"}>
              <strong>Câu {index + 1}. {question.prompt}</strong>
              <p><b>Bạn chọn:</b> {chosen?.text ?? "Chưa chọn"}</p>
              <p><b>Đáp án đúng:</b> {correct?.text}</p>
              <p>{question.explanation}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
