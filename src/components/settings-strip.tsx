import { PanelRightOpen, Zap } from "lucide-react";

interface SettingsStripProps {
  autoNext: boolean;
  paletteOpen: boolean;
  showAutoNext: boolean;
  onAutoNextChange: (value: boolean) => void;
  onPaletteOpenChange: (value: boolean) => void;
}

export function SettingsStrip({
  autoNext,
  paletteOpen,
  showAutoNext,
  onAutoNextChange,
  onPaletteOpenChange
}: SettingsStripProps) {
  return (
    <section className="settings-strip" aria-label="Cài đặt học">
      {showAutoNext ? (
        <label>
          <input type="checkbox" checked={autoNext} onChange={(event) => onAutoNextChange(event.target.checked)} />
          <Zap size={16} />
          <span className="auto-next-text">Tự sang câu sau khi đúng</span>
        </label>
      ) : (
        <span className="exam-hint">
          <span className="exam-hint-full">Thi thử chỉ chấm sau khi nộp bài</span>
          <span className="exam-hint-short">Chấm khi nộp bài</span>
        </span>
      )}
      <button
        className="palette-toggle"
        onClick={() => onPaletteOpenChange(!paletteOpen)}
        aria-label={paletteOpen ? "Đóng ma trận câu hỏi" : "Mở ma trận câu hỏi"}
      >
        <PanelRightOpen size={18} />
        <span className="palette-toggle-full">Ma trận câu hỏi</span>
        <span className="palette-toggle-short">Ma trận</span>
      </button>
    </section>
  );
}
