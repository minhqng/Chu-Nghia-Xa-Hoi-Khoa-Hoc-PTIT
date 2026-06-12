import { X } from "lucide-react";
import { getPaletteStatus } from "../lib/answer-view";
import type { NormalizedQuestion, QuizSessionState } from "../types/quiz";

interface QuestionPaletteProps {
  questions: NormalizedQuestion[];
  session: QuizSessionState;
  submitted: boolean;
  open: boolean;
  onJump: (index: number) => void;
  onClose: () => void;
}

export function QuestionPalette({ questions, session, submitted, open, onJump, onClose }: QuestionPaletteProps) {
  return (
    <aside className={open ? "palette open" : "palette"} aria-label="Ma trận câu hỏi">
      <div className="palette-head">
        <strong>Ma trận câu hỏi</strong>
        <button className="icon-button mobile-only" onClick={onClose} aria-label="Đóng ma trận">
          <X size={18} />
        </button>
      </div>
      <div className="legend">
        <span><i className="empty" /> Chưa làm</span>
        <span><i className="current" /> Đang xem</span>
        <span><i className="correct" /> Đúng</span>
        <span><i className="wrong" /> Sai</span>
        <span><i className="selected" /> Đã chọn</span>
      </div>
      <div className="palette-grid">
        {questions.map((question, index) => {
          const status = getPaletteStatus(question, session, index, submitted);
          return (
            <button
              key={question.id}
              className={`palette-cell ${status}`}
              onClick={() => onJump(index)}
              aria-label={`Đến câu ${index + 1}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
