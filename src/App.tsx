import { Menu, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ExamSetup } from "./components/exam-setup";
import { ModeSwitch } from "./components/mode-switch";
import { QuestionCard } from "./components/question-card";
import { QuestionPalette } from "./components/question-palette";
import { QuizNavigation } from "./components/quiz-navigation";
import { ResultsView } from "./components/results-view";
import { SettingsStrip } from "./components/settings-strip";
import { SourceSelector } from "./components/source-selector";
import { StatsBar } from "./components/stats-bar";
import { allQuestions, getQuestionsForScope, questionSources } from "./data/question-bank";
import { useClockSeconds } from "./hooks/use-clock-seconds";
import { usePersistentState } from "./hooks/use-persistent-state";
import { createAnswerRecord, createExamSession, createPracticeSession, formatClock, scoreSession } from "./lib/quiz-engine";
import { removeStorage, storageKeys } from "./lib/storage";
import type { NormalizedQuestion, QuizSessionState, SourceId, StudySettings } from "./types/quiz";

const defaultSettings: StudySettings = {
  autoNext: true,
  paletteOpen: true,
  mode: "practice",
  sourceId: "question-bank",
  chapterId: "all"
};

function clampIndex(index: number, total: number) {
  return Math.min(Math.max(index, 0), Math.max(total - 1, 0));
}

function resolveQuestions(session: QuizSessionState | null): NormalizedQuestion[] {
  if (!session) return [];
  const map = new Map(allQuestions.map((question) => [question.id, question]));
  return session.questionIds.map((id) => map.get(id)).filter(Boolean) as NormalizedQuestion[];
}

export default function App() {
  const [settings, setSettings] = usePersistentState(storageKeys.settings, () => defaultSettings);
  const [examCount, setExamCount] = useState(50);
  const scopedQuestions = useMemo(
    () => getQuestionsForScope(settings.sourceId, settings.chapterId),
    [settings.sourceId, settings.chapterId]
  );
  const practiceKey = storageKeys.practice(settings.sourceId, settings.chapterId);
  const [practiceSession, setPracticeSession] = usePersistentState(practiceKey, () =>
    createPracticeSession(scopedQuestions)
  );
  const [examSession, setExamSession] = usePersistentState<QuizSessionState | null>(storageKeys.exam, () => null);
  const session = settings.mode === "practice" ? practiceSession : examSession;
  const questions = settings.mode === "practice" ? scopedQuestions : resolveQuestions(examSession);
  const submitted = Boolean(session?.submittedAt);
  const elapsed = useClockSeconds(session?.startedAt ?? Date.now(), submitted);
  const remaining = session?.durationSeconds ? session.durationSeconds - elapsed : 0;
  const score = session ? scoreSession(session) : { total: 0, answered: 0, correct: 0, wrong: 0, percent: 0 };
  const currentIndex = session ? clampIndex(session.currentIndex, questions.length) : 0;
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const expectedIds = scopedQuestions.map((question) => question.id).join("|");
    if (practiceSession.questionIds.join("|") !== expectedIds) {
      setPracticeSession(createPracticeSession(scopedQuestions));
    }
  }, [practiceKey, scopedQuestions, practiceSession.questionIds, setPracticeSession]);

  useEffect(() => {
    if (settings.mode === "exam" && examSession && !examSession.submittedAt && remaining <= 0) {
      setExamSession({ ...examSession, submittedAt: Date.now() });
    }
  }, [settings.mode, examSession, remaining, setExamSession]);

  function updateSettings(patch: Partial<StudySettings>) {
    setSettings((current) => ({ ...current, ...patch }));
  }

  function updateSession(updater: (session: QuizSessionState) => QuizSessionState) {
    if (!session) return;
    if (settings.mode === "practice") setPracticeSession(updater);
    else setExamSession((current) => (current ? updater(current) : current));
  }

  function handleAnswer(answerId: string, isCorrect: boolean) {
    if (!session || submitted) return;
    if (settings.mode === "practice" && session.answers[currentQuestion.id]) return;
    const answeredIndex = currentIndex;

    updateSession((current) => ({
      ...current,
      answers: {
        ...current.answers,
        [currentQuestion.id]: createAnswerRecord(answerId, isCorrect)
      }
    }));

    if (settings.mode === "practice" && settings.autoNext && isCorrect) {
      window.setTimeout(() => {
        setPracticeSession((current) =>
          current.currentIndex === answeredIndex
            ? { ...current, currentIndex: clampIndex(current.currentIndex + 1, current.questionIds.length) }
            : current
        );
      }, 1500);
    }
  }

  function resetCurrentSession() {
    if (settings.mode === "practice") {
      removeStorage(practiceKey);
      setPracticeSession(createPracticeSession(scopedQuestions));
      return;
    }
    removeStorage(storageKeys.exam);
    setExamSession(null);
  }

  function startExam() {
    setExamSession(createExamSession(allQuestions, examCount));
  }

  const timerText = settings.mode === "practice" ? formatClock(elapsed) : formatClock(remaining);
  const canShowQuiz = session && currentQuestion && (settings.mode === "practice" || examSession);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">PTIT · Chủ Nghĩa Xã Hội Khoa Học</p>
          <h1>CNXH Quiz Sprint</h1>
        </div>
        <ModeSwitch mode={settings.mode} onChange={(mode) => updateSettings({ mode })} />
      </header>

      <main className={settings.mode === "exam" ? "workspace exam-workspace" : "workspace"}>
        {settings.mode === "practice" && (
          <SourceSelector
            sources={questionSources}
            selectedSourceId={settings.sourceId}
            selectedChapterId={settings.chapterId}
            onSourceChange={(sourceId: SourceId) => updateSettings({ sourceId, chapterId: "all" })}
            onChapterChange={(chapterId) => updateSettings({ chapterId })}
          />
        )}

        <section className="study-area">
          <SettingsStrip
            autoNext={settings.autoNext}
            paletteOpen={settings.paletteOpen}
            showAutoNext={settings.mode === "practice"}
            onAutoNextChange={(autoNext) => updateSettings({ autoNext })}
            onPaletteOpenChange={(paletteOpen) => updateSettings({ paletteOpen })}
          />

          {settings.mode === "exam" && !examSession && (
            <ExamSetup
              totalQuestions={allQuestions.length}
              count={examCount}
              onCountChange={setExamCount}
              onStart={startExam}
            />
          )}

          {settings.mode === "exam" && submitted && examSession && (
            <ResultsView questions={questions} session={examSession} onRestart={resetCurrentSession} />
          )}

          {canShowQuiz && !submitted && (
            <>
              <StatsBar mode={settings.mode} score={score} current={currentIndex + 1} timerText={timerText} showScore={settings.mode === "practice" || submitted} />
              <QuestionCard
                question={currentQuestion}
                number={currentIndex + 1}
                total={questions.length}
                mode={settings.mode}
                answer={session.answers[currentQuestion.id]}
                submitted={submitted}
                onAnswer={handleAnswer}
              />
              <QuizNavigation
                mode={settings.mode}
                canGoPrevious={currentIndex > 0}
                canGoNext={currentIndex < questions.length - 1}
                submitted={submitted}
                onPrevious={() => updateSession((current) => ({ ...current, currentIndex: current.currentIndex - 1 }))}
                onNext={() => updateSession((current) => ({ ...current, currentIndex: current.currentIndex + 1 }))}
                onSubmit={() => updateSession((current) => ({ ...current, submittedAt: Date.now() }))}
                onReset={resetCurrentSession}
              />
            </>
          )}
        </section>

        {canShowQuiz && !submitted && (
          <QuestionPalette
            questions={questions}
            session={session}
            submitted={submitted}
            open={settings.paletteOpen}
            onJump={(index) => updateSession((current) => ({ ...current, currentIndex: index }))}
            onClose={() => updateSettings({ paletteOpen: false })}
          />
        )}
      </main>

      {!settings.paletteOpen && canShowQuiz && !submitted && (
        <button className="floating-palette" onClick={() => updateSettings({ paletteOpen: true })}>
          <Menu size={18} />
          Ma trận
        </button>
      )}

      <footer>
        <span>Built for rapid keyword recall.</span>
        <a href="mailto:minhnq@gdscptit.dev">minhnq@gdscptit.dev</a>
        <button onClick={resetCurrentSession}>
          <RotateCcw size={16} />
          Làm lại
        </button>
      </footer>
    </div>
  );
}
