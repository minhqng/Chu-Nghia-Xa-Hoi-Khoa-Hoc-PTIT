import { ArrowLeft, ArrowRight, CheckCheck, RotateCcw } from "lucide-react";
import type { QuizMode } from "../types/quiz";

interface QuizNavigationProps {
  mode: QuizMode;
  canGoPrevious: boolean;
  canGoNext: boolean;
  submitted: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onReset: () => void;
}

export function QuizNavigation({
  mode,
  canGoPrevious,
  canGoNext,
  submitted,
  onPrevious,
  onNext,
  onSubmit,
  onReset
}: QuizNavigationProps) {
  return (
    <nav className="quiz-nav" aria-label="Điều hướng câu hỏi">
      <button onClick={onPrevious} disabled={!canGoPrevious}>
        <ArrowLeft size={18} />
        Câu trước
      </button>
      <button onClick={onNext} disabled={!canGoNext}>
        Câu tiếp theo
        <ArrowRight size={18} />
      </button>
      {mode === "exam" && !submitted && (
        <button className="submit-button" onClick={onSubmit}>
          <CheckCheck size={18} />
          Nộp bài
        </button>
      )}
      <button className="ghost-danger" onClick={onReset} aria-label="Làm lại từ đầu">
        <RotateCcw size={18} />
        Làm lại từ đầu
      </button>
    </nav>
  );
}
