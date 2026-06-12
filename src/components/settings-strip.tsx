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
          Tự sang câu sau khi đúng
        </label>
      ) : (
        <span className="exam-hint">Thi thử chỉ chấm sau khi nộp bài</span>
      )}
      <button className="palette-toggle" onClick={() => onPaletteOpenChange(!paletteOpen)}>
        <PanelRightOpen size={18} />
        Ma trận câu hỏi
      </button>
    </section>
  );
}
