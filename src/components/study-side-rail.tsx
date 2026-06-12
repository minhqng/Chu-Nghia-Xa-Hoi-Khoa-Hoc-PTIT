import { QuestionPalette } from "./question-palette";
import { SourceSelector } from "./source-selector";
import type { NormalizedQuestion, QuestionSource, QuizMode, QuizSessionState, SourceId } from "../types/quiz";

interface StudySideRailProps {
  mode: QuizMode;
  sources: QuestionSource[];
  selectedSourceId: SourceId;
  selectedChapterId: string;
  questions: NormalizedQuestion[];
  session: QuizSessionState | null;
  submitted: boolean;
  paletteOpen: boolean;
  showPalette: boolean;
  onSourceChange: (sourceId: SourceId) => void;
  onChapterChange: (chapterId: string) => void;
  onPaletteJump: (index: number) => void;
  onPaletteClose: () => void;
}

export function StudySideRail({
  mode,
  sources,
  selectedSourceId,
  selectedChapterId,
  questions,
  session,
  submitted,
  paletteOpen,
  showPalette,
  onSourceChange,
  onChapterChange,
  onPaletteJump,
  onPaletteClose
}: StudySideRailProps) {
  return (
    <aside className="side-rail" aria-label="Tuy chon on tap">
      {mode === "practice" && (
        <SourceSelector
          sources={sources}
          selectedSourceId={selectedSourceId}
          selectedChapterId={selectedChapterId}
          onSourceChange={onSourceChange}
          onChapterChange={onChapterChange}
        />
      )}

      {showPalette && session && (
        <QuestionPalette
          questions={questions}
          session={session}
          submitted={submitted}
          open={paletteOpen}
          onJump={onPaletteJump}
          onClose={onPaletteClose}
        />
      )}
    </aside>
  );
}
