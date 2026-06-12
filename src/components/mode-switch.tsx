import { BookOpen, ClipboardList } from "lucide-react";
import type { QuizMode } from "../types/quiz";

interface ModeSwitchProps {
  mode: QuizMode;
  onChange: (mode: QuizMode) => void;
}

export function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  return (
    <div className="mode-switch" aria-label="Chọn chế độ luyện tập">
      <button className={mode === "practice" ? "active" : ""} onClick={() => onChange("practice")}>
        <BookOpen size={18} />
        Ôn tập
      </button>
      <button className={mode === "exam" ? "active" : ""} onClick={() => onChange("exam")}>
        <ClipboardList size={18} />
        Thi thử
      </button>
    </div>
  );
}
