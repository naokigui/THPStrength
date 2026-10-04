import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Check,
  Clock,
  Dumbbell,
  Flame,
  Info,
  Pause,
  Play,
  RotateCcw,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';

type DayKey = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta';

interface Exercise {
  id: string;
  name: string;
  prescription: string;
  rest: string;
  cue: string;
  isIsometric?: boolean;
  holdSeconds?: number;
}

interface DayRoutine {
  key: DayKey;
  shortDay: string;
  fullDay: string;
  focusTitle: string;
  focusSubtitle: string;
  durationEst: string;
  tag: string;
  targetIcon: 'lower' | 'upper' | 'priming';
  exercises: Exercise[];
}

const WEEKLY_ROUTINES: DayRoutine[] = [
  {
    key: 'segunda',
    shortDay: 'SEG',
    fullDay: 'Segunda-Feira',
    focusTitle: 'Lower Body',
    focusSubtitle: 'Força Máxima & Pliometria Pesada',
    durationEst: '~60 min',
    tag: 'MAX EFFORT + PLYO',
    targetIcon: 'lower',
    exercises: [
      {
        id: 'seg-1',
        name: 'Cadeira Extensora Isométrica Unilateral',
        prescription: '2x 45s (cada perna)',
        rest: '60s',
        cue: 'Segurar a 30° da extensão total. Inibe a dor do tendão patelar e prepara os extensores do joelho para suportar altas cargas mecânicas.',
        isIsometric: true,
        holdSeconds: 45,
      },
      {
        id: 'seg-2',
        name: 'Depth Jumps',
        prescription: '3x 3 reps',
        rest: '90s - 120s',
        cue: 'Caia do banco de 30-40cm e reaja saltando o mais alto possível. Tempo de contato mínimo com o chão (< 200ms). Absorção com rigidez elástica.',
      },
      {
        id: 'seg-3',
        name: 'Pogo Jumps',
        prescription: '2x 10 reps',
        rest: '60s',
        cue: 'Mínimo tempo de contato com o chão. Tornozelos travados a 90°, utilize o reflexo do tendão de Aquiles como uma mola de aço.',
      },
      {
        id: 'seg-4',
        name: 'Agachamento Livre / Trap Bar',
        prescription: '4x 3-5 reps',
        rest: '3 min',
        cue: '80-85% 1RM. Descida controlada e subida explosiva com intenção máxima de velocidade concêntrica. Descanso completo entre as séries.',
      },
      {
        id: 'seg-5',
        name: 'RDL com Barra / Halter',
        prescription: '3x 6-8 reps',
        rest: '90s',
        cue: 'Foco em posterior de coxa e glúteos. Projete o quadril para trás mantendo coluna neutra e joelhos semi-flexionados.',
      },
      {
        id: 'seg-6',
        name: 'Panturrilha em Pé com Pausa',
        prescription: '3x 8 reps',
        rest: '60s',
        cue: 'Pausa de 2s no topo e 2s embaixo. Elimina a assistência elástica passiva e desenvolve força nos gastrocnêmios para a decolagem.',
      },
    ],
  },

  {
    key: 'terca',
    shortDay: 'TER',
    fullDay: 'Terça-Feira',
    focusTitle: 'Upper Body',
    focusSubtitle: 'Força & Potência (Arm Drive para Vôlei)',
    durationEst: '~50 min',
    tag: 'ARM DRIVE & FORÇA',
    targetIcon: 'upper',
    exercises: [
      {
        id: 'ter-1',
        name: 'Supino Reto (Barra / Halter)',
        prescription: '3x 5 reps',
        rest: '2 min',
        cue: 'Força máxima e estabilidade escapular. Empurre com aceleração e controle a descida na altura do esterno.',
      },
      {
        id: 'ter-2',
        name: 'Barra Fixa (Pull-ups) / Remada Curvada',
        prescription: '3x 5-6 reps',
        rest: '90s',
        cue: 'Puxada forte para desenvolver o Arm Drive. A oscilação agressiva de braços para trás e para cima adiciona até 15% na altura do salto.',
      },
      {
        id: 'ter-3',
        name: 'Landmine Press / Desenvolvimento',
        prescription: '3x 6-8 reps',
        rest: '90s',
        cue: 'Potência de ombros e transferência diagonal de força através do core, crucial para ataques e bloqueios no voleibol.',
      },
      {
        id: 'ter-4',
        name: 'Remada Unilateral (Serrote)',
        prescription: '3x 8-10 reps',
        rest: '60s',
        cue: 'Puxe o cotovelo em direção ao quadril sem girar o tronco. Estabilidade e equilíbrio muscular para o ombro dominante.',
      },
      {
        id: 'ter-5',
        name: 'Ab Wheel / Prancha com Peso',
        prescription: '3x 10-12 reps',
        rest: '60s',
        cue: 'Rigidez total do tronco. Evita a extensão lombar excessiva durante o arco do ataque no vôlei e previne dores lombares.',
      },
    ],
  },

  {
    key: 'quarta',
    shortDay: 'QUA',
    fullDay: 'Quarta-Feira',
    focusTitle: 'Lower Body',
    focusSubtitle: 'Velocidade, Reatividade & Saúde do Tendão',
    durationEst: '~50 min',
    tag: 'VELOCIDADE & TENDÃO',
    targetIcon: 'lower',
    exercises: [
      {
        id: 'qua-1',
        name: 'Wall Sit (Agachamento na Parede)',
        prescription: '2x 45s hold',
        rest: '60s',
        cue: 'Preparação e analgesia do joelho. 90° de flexão com peso distribuído no médiopé. Reduz o tônus doloroso do tendão patelar.',
        isIsometric: true,
        holdSeconds: 45,
      },
      {
        id: 'qua-2',
        name: 'Tibialis Raise na Parede',
        prescription: '2x 15 reps',
        rest: '45s',
        cue: 'Prevenção de canelite e desaceleração do pé de bloqueio. Puxe a ponta dos pés o mais alto possível a cada repetição.',
      },
      {
        id: 'qua-3',
        name: 'Box Jump com Contramovimento',
        prescription: '3x 3 reps',
        rest: '90s',
        cue: 'Decolar rápido, aterrissar leve. Salto sobre a caixa eliminando o impacto da queda para poupar as articulações.',
      },
      {
        id: 'qua-4',
        name: 'Speed Squat (Agachamento Rápido)',
        prescription: '4x 3 reps',
        rest: '90s',
        cue: '50-60% da carga máxima. Foco estrito em velocidade máxima de subida (Max Intent). Se a velocidade cair, encerre a série.',
      },
      {
        id: 'qua-5',
        name: 'Afundo Búlgaro',
        prescription: '3x 6-8 reps por perna',
        rest: '60s',
        cue: 'Força e estabilidade unilateral de quadril e joelho. Fundamental para aterrissagens desbalanceadas na rede.',
      },
      {
        id: 'qua-6',
        name: 'Mesa / Cadeira Flexora',
        prescription: '3x 10-12 reps',
        rest: '60s',
        cue: 'Fase de descida (excêntrica) bem lenta (3 a 4 segundos). Proteção de isquiotibiais em frenagens bruscas.',
      },
    ],
  },

  {
    key: 'quinta',
    shortDay: 'QUI',
    fullDay: 'Quinta-Feira',
    focusTitle: 'Upper Body',
    focusSubtitle: 'Saúde Articular, Manguito & Estabilidade para Vôlei',
    durationEst: '~45 min',
    tag: 'OMBRO BLINDADO & CORE',
    targetIcon: 'upper',
    exercises: [
      {
        id: 'qui-1',
        name: 'Face Pulls na Polia com Rotação Externa',
        prescription: '3x 15 reps',
        rest: '60s',
        cue: 'Proteção do manguito rotador para os ataques. Puxe a corda em direção aos olhos e rode os punhos para trás no final.',
      },
      {
        id: 'qui-2',
        name: 'Puxada Alta (Lat Pulldown)',
        prescription: '3x 8-10 reps',
        rest: '75s',
        cue: 'Controle rigoroso na subida. Fortalecimento dorsal e estabilidade do complexo do ombro durante o bloqueio.',
      },
      {
        id: 'qui-3',
        name: 'Crucifixo Inverso',
        prescription: '3x 12-15 reps',
        rest: '60s',
        cue: 'Posterior de ombro e romboides. Corrige a postura de ombros protusos gerada pelos golpes repetitivos de ataque.',
      },
      {
        id: 'qui-4',
        name: 'Flexão de Braço Explosiva',
        prescription: '3x 6 reps',
        rest: '60s',
        cue: 'Sem chegar perto da falha muscular. Empurre o chão com tanta velocidade que as mãos quase percam o contato.',
      },
      {
        id: 'qui-5',
        name: 'Pallof Press na Polia',
        prescription: '3x 12 reps / lado',
        rest: '45s',
        cue: 'Estabilidade anti-rotação do core. Resista à força da carga sem deixar o tronco girar nem um centímetro.',
      },
    ],
  },

  {
    key: 'sexta',
    shortDay: 'SEX',
    fullDay: 'Sexta-Feira',
    focusTitle: 'Game Day Priming',
    focusSubtitle: '15 min Pré-Vôlei (Potenciação sem Fadiga)',
    durationEst: '~15 min',
    tag: 'POTENCIAÇÃO PRÉ-JOGO',
    targetIcon: 'priming',
    exercises: [
      {
        id: 'sex-1',
        name: 'Wall Sit',
        prescription: '2x 45s hold',
        rest: '45s',
        cue: 'Alívio de dor e analgesia nos joelhos. Supressão da inibição cortical motora antes da partida.',
        isIsometric: true,
        holdSeconds: 45,
      },
      {
        id: 'sex-2',
        name: 'Overcoming Isometric Squat',
        prescription: '2x 5s (100% intenção)',
        rest: '60s',
        cue: 'Empurrar o rack/parede com 100% de intenção. Ativa unidades motoras Tipo IIx (PAP) sem acúmulo de lactato nem queimação.',
        isIsometric: true,
        holdSeconds: 5,
      },
      {
        id: 'sex-3',
        name: 'Band Pull-Aparts',
        prescription: '2x 15 reps',
        rest: '30s',
        cue: 'Ativação leve de ombros e escápulas com elástico suave. Lubrifica a cápsula articular sem fadigar.',
      },
      {
        id: 'sex-4',
        name: 'Pogo Jumps Leves',
        prescription: '2x 10 reps',
        rest: '45s',
        cue: 'Ligar o sistema nervoso e calibrar a rigidez de tornozelo sem cansar. Sensação de pernas prontas e reativas para o jogo.',
      },
    ],
  },
];

export default function App() {
  // Determine initial day based on real day of week (Monday=1 -> 'segunda', Friday=5 -> 'sexta')
  const [activeDay, setActiveDay] = useState<DayKey>(() => {
    const dayOfWeek = new Date().getDay();
    if (dayOfWeek === 1) return 'segunda';
    if (dayOfWeek === 2) return 'terca';
    if (dayOfWeek === 3) return 'quarta';
    if (dayOfWeek === 4) return 'quinta';
    if (dayOfWeek === 5) return 'sexta';
    return 'segunda';
  });

  // Local completed exercises tracker
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('thp_vball_completed');
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    }
    return {};
  });

  // Save completion state
  useEffect(() => {
    try {
      localStorage.setItem('thp_vball_completed', JSON.stringify(completed));
    } catch {
      // ignore
    }
  }, [completed]);

  // Integrated Minimalist Rest / Hold Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(45);
  const [timerInitial, setTimerInitial] = useState<number>(45);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

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

  const startTimerWith = (seconds: number) => {
    setTimerInitial(seconds);
    setTimerSeconds(seconds);
    setTimerRunning(true);
  };

  const toggleTimer = () => {
    setTimerRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(timerInitial);
  };

  const toggleExercise = (id: string) => {
    setCompleted((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const activeRoutine =
    WEEKLY_ROUTINES.find((r) => r.key === activeDay) || WEEKLY_ROUTINES[0];

  const totalExercises = activeRoutine.exercises.length;
  const completedCount = activeRoutine.exercises.filter((e) => completed[e.id]).length;
  const progressPercent = Math.round((completedCount / totalExercises) * 100);

  const resetCurrentDay = () => {
    setCompleted((prev) => {
      const next = { ...prev };
      activeRoutine.exercises.forEach((e) => {
        delete next[e.id];
      });
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* STICKY TOP NAVBAR */}
      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-emerald-500/30 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold tracking-tight text-zinc-100">
                  THP <span className="text-emerald-400">VOLLEY JUMP</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                  5-DAY SPLIT
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Salto Vertical & Desempenho no Voleibol
              </p>
            </div>
          </div>

          {/* Integrated Stopwatch Widget */}
          <div className="flex items-center space-x-2 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-full">
            <Clock
              className={`w-3.5 h-3.5 ${
                timerRunning ? 'text-emerald-400 animate-spin' : 'text-zinc-400'
              }`}
            />
            <span
              className={`font-mono text-xs font-semibold ${
                timerRunning ? 'text-emerald-400' : 'text-zinc-200'
              }`}
            >
              {Math.floor(timerSeconds / 60)}:
              {timerSeconds % 60 < 10
                ? `0${timerSeconds % 60}`
                : timerSeconds % 60}
            </span>

            <button
              onClick={toggleTimer}
              className="p-1 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
              title={timerRunning ? 'Pausar' : 'Iniciar'}
            >
              {timerRunning ? (
                <Pause className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3 fill-current" />
              )}
            </button>

            <button
              onClick={resetTimer}
              className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Resetar"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 5-DAY SELECTOR TABS (Monday to Friday) */}
        <div className="border-t border-zinc-800/40">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-5 gap-1.5 py-2">
              {WEEKLY_ROUTINES.map((routine) => {
                const isActive = activeDay === routine.key;
                const isDayComplete = routine.exercises.every(
                  (e) => completed[e.id]
                );

                return (
                  <button
                    key={routine.key}
                    onClick={() => setActiveDay(routine.key)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-medium transition-all relative ${
                      isActive
                        ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent'
                    }`}
                  >
                    <span className="font-mono text-[11px] font-bold tracking-wider">
                      {routine.shortDay}
                    </span>
                    <span
                      className={`text-[10px] mt-0.5 truncate max-w-full font-mono ${
                        isActive ? 'text-emerald-400 font-semibold' : 'text-zinc-500'
                      }`}
                    >
                      {routine.key === 'sexta' ? 'Game Day' : routine.focusTitle}
                    </span>

                    {/* Completion green dot */}
                    {isDayComplete && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
        {/* CURRENT DAY HERO BANNER */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-medium">
                  {activeRoutine.tag}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  TEMPO: {activeRoutine.durationEst}
                </span>
              </div>

              <div className="pt-1">
                <span className="text-xs font-mono uppercase text-zinc-400 block tracking-wider">
                  {activeRoutine.fullDay}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
                  {activeRoutine.focusTitle}{' '}
                  <span className="text-zinc-400 font-normal text-base sm:text-lg">
                    ({activeRoutine.focusSubtitle})
                  </span>
                </h1>
              </div>
            </div>

            {/* PROGRESS COUNTER & RESET */}
            <div className="bg-zinc-950 border border-zinc-800/90 rounded-xl p-3 flex flex-col items-end min-w-[130px] shrink-0 self-start sm:self-auto">
              <div className="flex items-baseline space-x-1 font-mono text-zinc-200">
                <span className="text-base font-bold text-emerald-400">
                  {completedCount}
                </span>
                <span className="text-xs text-zinc-500">
                  / {totalExercises} feitos
                </span>
              </div>

              <div className="w-full h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {completedCount > 0 && (
                <button
                  onClick={resetCurrentDay}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300 mt-2 flex items-center space-x-1 transition-colors"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Limpar dia</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* QUICK TIMER SHORTCUTS */}
        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center space-x-2 text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-mono text-zinc-300">
              Disparar Descanso / Isometria:
            </span>
          </div>

          <div className="flex items-center space-x-1.5 font-mono">
            {[5, 30, 45, 60, 90, 180].map((sec) => (
              <button
                key={sec}
                onClick={() => startTimerWith(sec)}
                className={`px-2 py-0.5 rounded-md border text-xs transition-all ${
                  timerInitial === sec && timerRunning
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
              </button>
            ))}
          </div>
        </div>

        {/* EXERCISES LIST */}
        <div className="space-y-3">
          {activeRoutine.exercises.map((exercise, index) => {
            const isDone = !!completed[exercise.id];

            return (
              <div
                key={exercise.id}
                className={`border rounded-xl transition-all duration-200 ${
                  isDone
                    ? 'bg-zinc-950/40 border-emerald-500/30'
                    : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700/80'
                }`}
              >
                <div className="p-4 sm:p-5 space-y-3">
                  {/* Top Bar: Number + Name + Badges + Big Checkbox */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <span className="font-mono text-xs text-zinc-500 mt-0.5 select-none">
                        0{index + 1}.
                      </span>

                      <div className="space-y-1.5 flex-1">
                        <h2
                          className={`text-sm sm:text-base font-semibold leading-snug transition-colors ${
                            isDone
                              ? 'line-through text-zinc-500'
                              : 'text-zinc-100'
                          }`}
                        >
                          {exercise.name}
                        </h2>

                        {/* Badges: Prescription + Rest */}
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                          <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-emerald-400 font-semibold">
                            {exercise.prescription}
                          </span>

                          <span className="px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800/80 text-zinc-400 flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            <span>Descanso: {exercise.rest}</span>
                          </span>

                          {exercise.isIsometric && exercise.holdSeconds && (
                            <button
                              onClick={() => startTimerWith(exercise.holdSeconds!)}
                              className="px-2 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono flex items-center space-x-1 transition-all"
                            >
                              <Play className="w-2.5 h-2.5 fill-current" />
                              <span>Hold {exercise.holdSeconds}s</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Large Checkbox */}
                    <button
                      onClick={() => toggleExercise(exercise.id)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-400 text-black shadow-sm shadow-emerald-500/20'
                          : 'bg-zinc-950 border-zinc-800 text-transparent hover:border-emerald-500/50'
                      }`}
                      title={isDone ? 'Desmarcar' : 'Marcar como concluído'}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>

                  {/* THP Cue Quote Block */}
                  <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3 text-xs space-y-1">
                    <div className="flex items-center space-x-1.5 text-zinc-400 text-[10px] font-mono uppercase tracking-wider">
                      <Info className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Instrução THP</span>
                    </div>
                    <p className="text-zinc-300 text-xs leading-relaxed pl-4">
                      {exercise.cue}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500 font-mono">
        <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>THP VOLLEY JUMP • Metodologia The Highest Point</span>
          <span className="text-[11px] text-zinc-600">
            Força, Pliometria, Arm Drive & Priming Pré-Jogo
          </span>
        </div>
      </footer>
    </div>
  );
}
