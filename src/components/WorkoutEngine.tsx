import { useEffect, useState } from 'react';
import {
  Activity,
  Award,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  Info,
  Pause,
  Play,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';
import { THP_WORKOUT_DATABASE } from '../lib/workout-database';
import {
  DiagnosticResult,
  Exercise,
  UserProfile,
  WorkoutLogEntry,
  WorkoutSession,
} from '../types/thp';

interface WorkoutEngineProps {
  user: UserProfile;
  diagnostic: DiagnosticResult;
  onLogWorkout: (log: WorkoutLogEntry) => void;
  openPrimingModal: () => void;
}

export function WorkoutEngine({
  user,
  diagnostic,
  onLogWorkout,
  openPrimingModal,
}: WorkoutEngineProps) {
  // Select active workout from database (defaults to the one matching diagnostic)
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>(() => {
    const match = THP_WORKOUT_DATABASE.find(
      (w) => w.targetDeficit === diagnostic.dominantDeficit
    );
    return match ? match.id : THP_WORKOUT_DATABASE[0].id;
  });

  const activeWorkout =
    THP_WORKOUT_DATABASE.find((w) => w.id === selectedWorkoutId) ||
    THP_WORKOUT_DATABASE[0];

  // Set-tracking state
  const [completedSets, setCompletedSets] = useState<Record<string, number>>({});
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(
    activeWorkout.exercises[0]?.id || null
  );

  // Isometric / Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(45);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerInitial, setTimerInitial] = useState<number>(45);

  // Workout Session Log Modal / Form
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [sessionDuration, setSessionDuration] = useState<number>(
    activeWorkout.estimatedMinutes
  );
  const [sessionRpe, setSessionRpe] = useState<number>(8);
  const [sessionTendonDiscomfort, setSessionTendonDiscomfort] = useState<number>(
    diagnostic.input.tendonPainScale
  );
  const [perceivedJump, setPerceivedJump] = useState<number>(
    user.currentVerticalCm
  );
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [justLogged, setJustLogged] = useState<boolean>(false);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const startTimer = (seconds: number) => {
    setTimerInitial(seconds);
    setTimerSeconds(seconds);
    setTimerRunning(true);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(timerInitial);
  };

  const toggleSetComplete = (exerciseId: string, totalSets: number) => {
    setCompletedSets((prev) => {
      const current = prev[exerciseId] || 0;
      const next = current >= totalSets ? 0 : current + 1;
      return { ...prev, [exerciseId]: next };
    });
  };

  const handleFinishSession = () => {
    const newLog: WorkoutLogEntry = {
      id: `wlog_${Date.now()}`,
      workoutId: activeWorkout.id,
      workoutTitle: activeWorkout.title,
      completedAt: new Date().toISOString().split('T')[0],
      durationMinutes: sessionDuration,
      overallRpe: sessionRpe,
      perceivedJumpHeightCm: perceivedJump,
      tendonDiscomfort: sessionTendonDiscomfort,
      notes: sessionNotes || 'Sessão concluída com técnica rigorosa do Conjugado THP.',
    };

    onLogWorkout(newLog);
    setShowLogModal(false);
    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 4000);
  };

  // Group exercises by category block
  const isometricBlock = activeWorkout.exercises.filter(
    (e) => e.category === 'TENDON_ISOMETRIC'
  );
  const strengthBlock = activeWorkout.exercises.filter(
    (e) => e.category === 'MAX_STRENGTH' || e.category === 'DYNAMIC_POWER'
  );
  const plyoBlock = activeWorkout.exercises.filter(
    (e) => e.category === 'PLYOMETRIC_SSC' || e.category === 'CORE_POSTURE'
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Success alert */}
      {justLogged && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Sessão de treino registrada com sucesso no seu histórico atlético!</span>
          </div>
        </div>
      )}

      {/* Header & Session Selector */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-medium">
                SISTEMA CONJUGADO LONGO
              </span>
              <span className="text-zinc-500 text-xs font-mono">
                METODOLOGIA THP STRENGTH
              </span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight mt-1">
              {activeWorkout.title}
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              {activeWorkout.subtitle}
            </p>
          </div>

          {/* Quick Workout Switcher Dropdown */}
          <div className="flex items-center space-x-2">
            <label className="text-xs text-zinc-400">Sessão:</label>
            <select
              value={selectedWorkoutId}
              onChange={(e) => setSelectedWorkoutId(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              {THP_WORKOUT_DATABASE.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.dayType} - {w.title.slice(0, 32)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Prescription Rationale Box */}
        <div className="mt-4 bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start space-x-2 text-zinc-300">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[12px] text-zinc-400">
              <span className="text-zinc-200 font-semibold">Justificativa THP: </span>
              {activeWorkout.rationale}
            </p>
          </div>
          <div className="shrink-0 flex items-center space-x-2 text-[11px] font-mono text-zinc-400">
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
              ⏱ {activeWorkout.estimatedMinutes} min
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">
              ⚡ {activeWorkout.intensityDescription.split('/')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Floating / Sticky Isometric & Rest Timer Widget */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-sm shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-emerald-500/30 flex items-center justify-center">
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-zinc-400 uppercase">
              Cronômetro de Isometria & Descanso
            </span>
            <div className="flex items-baseline space-x-2">
              <span
                className={`text-2xl font-mono font-bold tracking-wider ${
                  timerRunning ? 'text-emerald-400 animate-pulse' : 'text-zinc-100'
                }`}
              >
                00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
              </span>
              <span className="text-xs text-zinc-500">
                {timerRunning ? 'Contando hold...' : 'Parado'}
              </span>
            </div>
          </div>
        </div>

        {/* Timer Presets & Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 mr-2">
            {[30, 45, 60, 90].map((sec) => (
              <button
                key={sec}
                onClick={() => startTimer(sec)}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-all ${
                  timerInitial === sec
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>

          <button
            onClick={() => setTimerRunning(!timerRunning)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              timerRunning
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20 hover:bg-emerald-400'
            }`}
          >
            {timerRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Iniciar</span>
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            title="Resetar cronômetro"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* WORKOUT BLOCKS */}
      <div className="space-y-6">
        {/* BLOCO 1: ATIVAÇÃO & SAÚDE DO TENDÃO */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200 font-mono">
                BLOCO 1: Saúde do Tendão & Isometria Analgésica
              </h2>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">
              Inibição Cortical & Remodelamento
            </span>
          </div>

          <div className="space-y-3">
            {isometricBlock.map((ex) => (
              <ExerciseRow
                key={ex.id}
                exercise={ex}
                completedSets={completedSets[ex.id] || 0}
                onToggleSet={() => toggleSetComplete(ex.id, ex.sets)}
                isExpanded={expandedExerciseId === ex.id}
                onToggleExpand={() =>
                  setExpandedExerciseId(
                    expandedExerciseId === ex.id ? null : ex.id
                  )
                }
                onStartHold={() => startTimer(45)}
              />
            ))}
          </div>
        </div>

        {/* BLOCO 2: FORÇA & POTÊNCIA */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
            <div className="flex items-center space-x-2">
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200 font-mono">
                BLOCO 2: Força Máxima / Dinâmica (Conjugado)
              </h2>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">
              Recrutamento Neural IIx
            </span>
          </div>

          <div className="space-y-3">
            {strengthBlock.map((ex) => (
              <ExerciseRow
                key={ex.id}
                exercise={ex}
                completedSets={completedSets[ex.id] || 0}
                onToggleSet={() => toggleSetComplete(ex.id, ex.sets)}
                isExpanded={expandedExerciseId === ex.id}
                onToggleExpand={() =>
                  setExpandedExerciseId(
                    expandedExerciseId === ex.id ? null : ex.id
                  )
                }
                onStartHold={() => startTimer(90)}
              />
            ))}
          </div>
        </div>

        {/* BLOCO 3: PLIOMETRIA & ELASTICIDADE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200 font-mono">
                BLOCO 3: Pliometria & Ciclo Alongamento-Encurtamento (SSC)
              </h2>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">
              Rigidez & Tempo de Contato Rápido
            </span>
          </div>

          <div className="space-y-3">
            {plyoBlock.map((ex) => (
              <ExerciseRow
                key={ex.id}
                exercise={ex}
                completedSets={completedSets[ex.id] || 0}
                onToggleSet={() => toggleSetComplete(ex.id, ex.sets)}
                isExpanded={expandedExerciseId === ex.id}
                onToggleExpand={() =>
                  setExpandedExerciseId(
                    expandedExerciseId === ex.id ? null : ex.id
                  )
                }
                onStartHold={() => startTimer(60)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Complete Workout CTA */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800">
        <button
          onClick={openPrimingModal}
          className="text-xs text-zinc-400 hover:text-emerald-400 flex items-center space-x-1.5 transition-colors"
        >
          <Flame className="w-4 h-4 text-emerald-400" />
          <span>Jogo amanhã? Ativar rotina de Game Day Priming</span>
        </button>

        <button
          onClick={() => setShowLogModal(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs tracking-wide transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Concluir Sessão & Registrar Histórico</span>
        </button>
      </div>

      {/* SESSION LOG MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-zinc-100">
                  Registrar Sessão de Treino THP
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {activeWorkout.title}
                </p>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-zinc-500 hover:text-zinc-200 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">
                    Duração Efetiva (minutos)
                  </label>
                  <input
                    type="number"
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">
                    Salto Vertical Percebido (cm)
                  </label>
                  <input
                    type="number"
                    value={perceivedJump}
                    onChange={(e) => setPerceivedJump(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-zinc-400">
                    RPE da Sessão (Percepção de Esforço 1-10)
                  </label>
                  <span className="font-mono text-emerald-400 font-bold">
                    {sessionRpe} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={sessionRpe}
                  onChange={(e) => setSessionRpe(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-zinc-400">
                    Desconforto nos Tendões (Escala 0-10)
                  </label>
                  <span
                    className={`font-mono font-bold ${
                      sessionTendonDiscomfort >= 4
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {sessionTendonDiscomfort} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={sessionTendonDiscomfort}
                  onChange={(e) =>
                    setSessionTendonDiscomfort(Number(e.target.value))
                  }
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">
                  Notas de Desempenho / Cargas da Sessão
                </label>
                <textarea
                  rows={3}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Ex: Agachamento com pausa subiu muito fácil com 125kg. Pliometria com tempo de contato rápido."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-800">
              <button
                onClick={() => setShowLogModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleFinishSession}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-md shadow-emerald-500/20"
              >
                Salvar Sessão no Perfil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Exercise Row with Set Tracker & Biomechanical Cues
function ExerciseRow({
  exercise,
  completedSets,
  onToggleSet,
  isExpanded,
  onToggleExpand,
  onStartHold,
}: {
  exercise: Exercise;
  completedSets: number;
  onToggleSet: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onStartHold: () => void;
}) {
  const isDone = completedSets >= exercise.sets;

  return (
    <div
      className={`border rounded-xl transition-all ${
        isDone
          ? 'bg-zinc-950/40 border-emerald-500/20'
          : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700/80'
      }`}
    >
      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Exercise Info */}
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={onToggleSet}
            className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
              isDone
                ? 'bg-emerald-500 text-black border-emerald-400'
                : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-emerald-500/50'
            }`}
            title="Clique para marcar série concluída"
          >
            {isDone ? (
              <CheckCircle className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <span className="text-[11px] font-mono">{completedSets}</span>
            )}
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-semibold text-zinc-100">
                {exercise.name}
              </h3>
              {exercise.tendonFriendly && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Tendon Safe
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3 text-[11px] text-zinc-400 mt-1 font-mono">
              <span className="text-zinc-200 font-semibold">{exercise.reps}</span>
              <span className="text-zinc-700">|</span>
              <span>Descanso: {exercise.restSeconds}s</span>
              <span className="text-zinc-700">|</span>
              <span>RPE Alvo: {exercise.targetRpe}</span>
            </div>
          </div>
        </div>

        {/* Set Dots & Expand CTA */}
        <div className="flex items-center space-x-3 self-end md:self-auto">
          {/* Sets Visual Indicator */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: exercise.sets }).map((_, idx) => (
              <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx < completedSets
                    ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                    : 'bg-zinc-800'
                }`}
              />
            ))}
          </div>

          {exercise.category === 'TENDON_ISOMETRIC' && (
            <button
              onClick={onStartHold}
              className="text-[11px] font-mono px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/30 transition-all flex items-center space-x-1"
            >
              <Clock className="w-3 h-3" />
              <span>Timer 45s</span>
            </button>
          )}

          <button
            onClick={onToggleExpand}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-200"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Coaching Cues */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-zinc-800/60 text-xs space-y-2">
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
              Dica Técnica THP (Biomecânica)
            </span>
            <p className="text-zinc-300 leading-relaxed">{exercise.cues}</p>
          </div>

          {exercise.tempo && (
            <div className="flex items-center space-x-2 text-[11px] text-zinc-400 font-mono">
              <span className="text-zinc-500">Cadência/Tempo:</span>
              <span className="text-zinc-300">{exercise.tempo}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
