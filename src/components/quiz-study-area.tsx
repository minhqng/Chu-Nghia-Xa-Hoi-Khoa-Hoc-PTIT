import { ExamSetup } from "./exam-setup";
import { QuestionCard } from "./question-card";
import { QuizNavigation } from "./quiz-navigation";
import { ResultsView } from "./results-view";
import { SettingsStrip } from "./settings-strip";
import { StatsBar } from "./stats-bar";
import type { ScoreSummary } from "../lib/quiz-engine";
import type { NormalizedQuestion, QuizSessionState, StudySettings } from "../types/quiz";

interface QuizStudyAreaProps {
  settings: StudySettings;
  examSession: QuizSessionState | null;
  session: QuizSessionState | null;
  questions: NormalizedQuestion[];
  currentQuestion?: NormalizedQuestion;
  examCount: number;
  totalQuestions: number;
  submitted: boolean;
  canShowQuiz: boolean;
  score: ScoreSummary;
  currentIndex: number;
  timerText: string;
  onSettingsChange: (patch: Partial<StudySettings>) => void;
  onExamCountChange: (count: number) => void;
  onStartExam: () => void;
  onAnswer: (answerId: string, isCorrect: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onReset: () => void;
}

export function QuizStudyArea({
  settings,
  examSession,
  session,
  questions,
  currentQuestion,
  examCount,
  totalQuestions,
  submitted,
  canShowQuiz,
  score,
  currentIndex,
  timerText,
  onSettingsChange,
  onExamCountChange,
  onStartExam,
  onAnswer,
  onPrevious,
  onNext,
  onSubmit,
  onReset
}: QuizStudyAreaProps) {
  return (
    <section className="study-area">
      <SettingsStrip
        autoNext={settings.autoNext}
        paletteOpen={settings.paletteOpen}
        showAutoNext={settings.mode === "practice"}
        onAutoNextChange={(autoNext) => onSettingsChange({ autoNext })}
        onPaletteOpenChange={(paletteOpen) => onSettingsChange({ paletteOpen })}
      />

      {settings.mode === "exam" && !examSession && (
        <ExamSetup
          totalQuestions={totalQuestions}
          count={examCount}
          onCountChange={onExamCountChange}
          onStart={onStartExam}
        />
      )}

      {settings.mode === "exam" && submitted && examSession && (
        <ResultsView questions={questions} session={examSession} onRestart={onReset} />
      )}

      {canShowQuiz && session && currentQuestion && !submitted && (
        <>
          <StatsBar
            mode={settings.mode}
            score={score}
            current={currentIndex + 1}
            timerText={timerText}
            showScore={settings.mode === "practice" || submitted}
          />
          <QuestionCard
            question={currentQuestion}
            number={currentIndex + 1}
            total={questions.length}
            mode={settings.mode}
            answer={session.answers[currentQuestion.id]}
            submitted={submitted}
            onAnswer={onAnswer}
          />
          <QuizNavigation
            mode={settings.mode}
            canGoPrevious={currentIndex > 0}
            canGoNext={currentIndex < questions.length - 1}
            submitted={submitted}
            onPrevious={onPrevious}
            onNext={onNext}
            onSubmit={onSubmit}
            onReset={onReset}
          />
        </>
      )}
    </section>
  );
}
