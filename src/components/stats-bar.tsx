import { Clock, Target } from "lucide-react";
import type { QuizMode } from "../types/quiz";
import type { ScoreSummary } from "../lib/quiz-engine";

interface StatsBarProps {
  mode: QuizMode;
  score: ScoreSummary;
  current: number;
  timerText: string;
}

export function StatsBar({ mode, score, current, timerText }: StatsBarProps) {
  const progress = score.total === 0 ? 0 : Math.round((score.answered / score.total) * 100);

  return (
    <section className="stats-bar" aria-label="Tiến trình">
      <div className="progress-wrap">
        <div className="progress-copy">
          <span>Câu {current} / {score.total}</span>
          <strong>{progress}% hoàn thành</strong>
        </div>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="stat-pills">
        <span><Target size={16} /> Đúng {score.correct}</span>
        <span>Sai {score.wrong}</span>
        <span>Tổng {score.total}</span>
        <span><Clock size={16} /> {mode === "practice" ? "Đếm lên" : "Còn lại"} {timerText}</span>
      </div>
    </section>
  );
}
