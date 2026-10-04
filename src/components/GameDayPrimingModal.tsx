import { useEffect, useState } from 'react';
import {
  Activity,
  Award,
  CheckCircle,
  Clock,
  Flame,
  Info,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Volume2,
  Zap,
} from 'lucide-react';
import { THP_GAME_DAY_PRIMING_ROUTINE } from '../lib/workout-database';
import { PrimingExercise } from '../types/thp';

interface GameDayPrimingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GameDayPrimingModal({ isOpen, onClose }: GameDayPrimingModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const currentExercise: PrimingExercise = THP_GAME_DAY_PRIMING_ROUTINE[currentStepIndex];

  // Priming Timer
  const [secondsLeft, setSecondsLeft] = useState<number>(
    currentExercise?.durationSeconds || 45
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (currentExercise) {
      setSecondsLeft(currentExercise.durationSeconds || 45);
      setIsRunning(false);
    }
  }, [currentStepIndex]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  if (!isOpen) return null;

  const nextStep = () => {
    if (currentStepIndex < THP_GAME_DAY_PRIMING_ROUTINE.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setIsCompleted(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glowing background accent */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center">
              <Flame className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-zinc-100 font-mono tracking-tight">
                  GAME DAY PRIMING
                </h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Pré-Jogo (12h a 24h)
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Potenciação Pós-Ativação (PAP) & Analgesia de Tendão sem Fadiga Residual
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 text-sm font-mono p-1 rounded-lg hover:bg-zinc-900"
          >
            ✕
          </button>
        </div>

        {!isCompleted ? (
          <div className="space-y-6">
            {/* Step navigation dots */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">
                FASE {currentStepIndex + 1} DE {THP_GAME_DAY_PRIMING_ROUTINE.length}
              </span>
              <div className="flex space-x-1.5">
                {THP_GAME_DAY_PRIMING_ROUTINE.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentStepIndex
                        ? 'w-6 bg-emerald-400'
                        : idx < currentStepIndex
                        ? 'w-3 bg-zinc-700'
                        : 'w-2 bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Exercise Display Card */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-1">
                    {currentExercise.phase === 'THERMAL_PULSE'
                      ? '1. Pulso Térmico'
                      : currentExercise.phase === 'TENDON_ANALGESIA'
                      ? '2. Analgesia do Tendão'
                      : currentExercise.phase === 'NEURAL_OVERCOMING'
                      ? '3. Overcoming Isometrics (PAP)'
                      : '4. Potenciação Elástica'}
                  </span>
                  <h3 className="text-xl font-bold text-zinc-100">
                    {currentExercise.name}
                  </h3>
                  <div className="mt-1 text-xs font-mono text-zinc-300">
                    Séries & Volume:{' '}
                    <span className="text-emerald-400 font-semibold">
                      {currentExercise.repsOrHold}
                    </span>
                  </div>
                </div>

                {/* Big Timer */}
                <div className="shrink-0 flex flex-col items-center bg-zinc-950 border border-zinc-800 px-4 py-2.5 rounded-xl">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">
                    Timer
                  </span>
                  <span
                    className={`text-2xl font-mono font-bold ${
                      isRunning ? 'text-emerald-400 animate-pulse' : 'text-zinc-100'
                    }`}
                  >
                    00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
                  </span>
                  <div className="flex space-x-1 mt-1.5">
                    <button
                      onClick={() => setIsRunning(!isRunning)}
                      className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono text-emerald-400 border border-zinc-700"
                    >
                      {isRunning ? 'Pause' : 'Start'}
                    </button>
                    <button
                      onClick={() => {
                        setIsRunning(false);
                        setSecondsLeft(currentExercise.durationSeconds || 45);
                      }}
                      className="px-1.5 py-0.5 rounded bg-zinc-900 text-[10px] text-zinc-500 hover:text-zinc-300"
                    >
                      ↺
                    </button>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3.5 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-0.5">
                    Como Executar:
                  </span>
                  <p className="text-zinc-300 leading-relaxed">
                    {currentExercise.instructions}
                  </p>
                </div>
                <div className="pt-2 border-t border-zinc-800/60">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-0.5">
                    Mecanismo Fisiológico THP:
                  </span>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    {currentExercise.purpose}
                  </p>
                </div>
              </div>
            </div>

            {/* Stepper Buttons */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:pointer-events-none"
              >
                Anterior
              </button>

              <button
                onClick={nextStep}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95"
              >
                <span>
                  {currentStepIndex === THP_GAME_DAY_PRIMING_ROUTINE.length - 1
                    ? 'Finalizar Priming'
                    : 'Próximo Passo'}
                </span>
                <Zap className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>
        ) : (
          /* Completion State */
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-100">
                Sistema Neuromuscular Potencializado!
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 leading-relaxed">
                Suas unidades motoras Tipo IIx foram recrutadas sem acúmulo de lactato. A inibição motora dos tendões patelares foi suprimida e o reflexo miotático está pronto para a partida.
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 max-w-sm mx-auto text-left text-xs space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Janela ótima de performance: 2h a 6h pós-priming</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Hidrate-se com eletrólitos e mantenha pernas aquecidas até o início do aquecimento na quadra.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20"
              >
                Retornar ao Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
