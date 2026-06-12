import { Layers, Library } from "lucide-react";
import type { QuestionSource, SourceId } from "../types/quiz";

interface SourceSelectorProps {
  sources: QuestionSource[];
  selectedSourceId: SourceId;
  selectedChapterId: string;
  onSourceChange: (sourceId: SourceId) => void;
  onChapterChange: (chapterId: string) => void;
}

export function SourceSelector({
  sources,
  selectedSourceId,
  selectedChapterId,
  onSourceChange,
  onChapterChange
}: SourceSelectorProps) {
  const selectedSource = sources.find((source) => source.id === selectedSourceId) ?? sources[0];
  const total = selectedSource.chapters.reduce((sum, chapter) => sum + chapter.questions.length, 0);

  return (
    <section className="study-picker" aria-label="Chọn học phần">
      <div className="panel-heading">
        <Library size={18} />
        <span>Nguồn ôn tập</span>
      </div>
      <div className="source-grid">
        {sources.map((source) => (
          <button
            key={source.id}
            className={source.id === selectedSourceId ? "source-card active" : "source-card"}
            onClick={() => onSourceChange(source.id)}
          >
            <strong>{source.label}</strong>
            <span>{source.description}</span>
          </button>
        ))}
      </div>
      <label className="select-label" htmlFor="chapter-select">
        <Layers size={16} />
        Chương
      </label>
      <select
        id="chapter-select"
        value={selectedChapterId}
        onChange={(event) => onChapterChange(event.target.value)}
      >
        <option value="all">Tất cả chương ({total} câu)</option>
        {selectedSource.chapters.map((chapter) => (
          <option key={chapter.id} value={chapter.id}>
            {chapter.title} ({chapter.questions.length} câu)
          </option>
        ))}
      </select>
    </section>
  );
}
