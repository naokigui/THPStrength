import {
  Activity,
  ArrowRight,
  Award,
  Calendar,
  CheckCircle,
  Dumbbell,
  Flame,
  LineChart,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { BiomechanicsRadar } from './BiomechanicsRadar';
import {
  DiagnosticResult,
  TendonHealthLog,
  UserProfile,
  WorkoutLogEntry,
} from '../types/thp';

interface DashboardProps {
  user: UserProfile;
  diagnostic: DiagnosticResult;
  workoutLogs: WorkoutLogEntry[];
  tendonLogs: TendonHealthLog[];
  onNavigateTab: (tab: 'dashboard' | 'diagnostic' | 'workouts' | 'tendons' | 'ai') => void;
  openPrimingModal: () => void;
}

export function Dashboard({
  user,
  diagnostic,
  workoutLogs,
  tendonLogs,
  onNavigateTab,
  openPrimingModal,
}: DashboardProps) {
  // Conversions
  const currentInches = (user.currentVerticalCm / 2.54).toFixed(1);
  const targetInches = (user.targetVerticalCm / 2.54).toFixed(1);
  const progressPct = Math.min(
    100,
    Math.round((user.currentVerticalCm / user.targetVerticalCm) * 100)
  );

  const isTendonAlert = (diagnostic.input?.tendonPainScale || 0) >= 3;

  // Chart data points: Jump height progression
  const jumpHistory = [
    { date: 'Sem 1', jump: user.currentVerticalCm - 6 },
    { date: 'Sem 2', jump: user.currentVerticalCm - 4 },
    { date: 'Sem 3', jump: user.currentVerticalCm - 2 },
    { date: 'Sem 4', jump: user.currentVerticalCm - 1 },
    { date: 'Atual', jump: user.currentVerticalCm },
  ];

  // Tendon pain history data points (reversed to chronological)
  const painHistory = [...tendonLogs]
    .slice(0, 5)
    .reverse()
    .map((l, idx) => ({
      label: `T${idx + 1}`,
      pain: l.painScore,
    }));

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Welcome & Game Day Banner */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-medium">
                PERFIL ATIVO: {diagnostic.deficitTitle}
              </span>
              <span className="text-xs font-mono text-zinc-400">
                {user.athleteType} • Dominância {user.jumpDominance}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
              Olá, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Sistema Conjugado Longo sintonizado para{' '}
              <strong className="text-zinc-200">
                {diagnostic.recommendedPhaseTitle}
              </strong>
              . Foco em elevar a força concêntrica e restaurar a rigidez tendínea sem sobrecarga nociva.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openPrimingModal}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold tracking-wide transition-all shadow-sm active:scale-95"
            >
              <Flame className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>GAME DAY PRIMING</span>
            </button>

            <button
              onClick={() => onNavigateTab('workouts')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold tracking-wide transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Iniciar Treino de Hoje</span>
            </button>
          </div>
        </div>
      </div>

      {/* METRIC CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Vertical Jump */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400">
              Salto Vertical Atual
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-bold text-zinc-100">
              {user.currentVerticalCm}
            </span>
            <span className="text-xs text-zinc-400 font-mono">cm</span>
            <span className="text-xs text-zinc-500 font-mono">
              ({currentInches}")
            </span>
          </div>

          {/* Target Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-zinc-400">
              <span>Progresso</span>
              <span>Meta: {user.targetVerticalCm} cm ({targetInches}")</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: EUR Ratio */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400">
              Índice EUR (CMJ / SJ)
            </span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-bold text-emerald-400">
              {diagnostic.eurRatio}
            </span>
            <span className="text-xs text-zinc-500 font-mono">Alvo: 1.10 - 1.15</span>
          </div>

          <p className="text-[11px] text-zinc-400 leading-tight">
            {diagnostic.eurRatio < 1.05
              ? 'Déficit Elástico: O contramovimento não recruta energia dos tendões.'
              : diagnostic.eurRatio > 1.20
              ? 'Déficit de Força: Salto estático muito fraco.'
              : 'Equilíbrio ideal do ciclo alongamento-encurtamento.'}
          </p>
        </div>

        {/* Card 3: Squat / BW Ratio */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400">
              Agachamento / Peso
            </span>
            <Dumbbell className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-bold text-zinc-100">
              {diagnostic.squatBwRatio}x
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              ({diagnostic.input.backSquat1RmKg} kg)
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 leading-tight">
            {diagnostic.squatBwRatio < 1.6
              ? 'Base abaixo de 1.6x BW limita o teto de impulsão concêntrica.'
              : 'Excelente base de força. Permite pliometria pesada.'}
          </p>
        </div>

        {/* Card 4: Tendon Pain Status */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400">
              Dor no Tendão
            </span>
            <ShieldAlert
              className={`w-4 h-4 ${
                isTendonAlert ? 'text-amber-400' : 'text-emerald-400'
              }`}
            />
          </div>

          <div className="flex items-baseline space-x-2">
            <span
              className={`text-3xl font-mono font-bold ${
                isTendonAlert ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {diagnostic.input.tendonPainScale}
            </span>
            <span className="text-xs text-zinc-500 font-mono">/ 10 escala</span>
          </div>

          <p className="text-[11px] text-zinc-400 leading-tight">
            {diagnostic.tendonVulnerabilityScore === 'HIGH'
              ? 'Alerta alto: Isometrias pesadas prescritas antes de qualquer impacto.'
              : 'Tendão tolerando carga e pliometria de intensidade.'}
          </p>
        </div>
      </div>

      {/* CHARTS & BIOMECHANICAL RADAR ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Progress Charts (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart 1: Vertical Jump Progression */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <LineChart className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100 font-mono">
                  Evolução do Salto Vertical (cm)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">
                +6 cm nas últimas 4 semanas
              </span>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="relative pt-4">
              <div className="h-44 w-full flex items-end justify-between px-2 pt-6">
                {jumpHistory.map((item, idx) => {
                  const min = user.currentVerticalCm - 10;
                  const max = user.targetVerticalCm;
                  const heightPct = Math.max(
                    20,
                    Math.min(100, ((item.jump - min) / (max - min)) * 100)
                  );

                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer"
                    >
                      <span className="text-[11px] font-mono font-bold text-zinc-200 mb-1 group-hover:text-emerald-400 transition-colors">
                        {item.jump}cm
                      </span>
                      <div className="w-8 sm:w-12 bg-zinc-800/80 group-hover:bg-emerald-500/20 border border-zinc-700/60 group-hover:border-emerald-500/50 rounded-t-lg transition-all flex items-end justify-center pb-1"
                        style={{ height: `${heightPct}%` }}
                      >
                        <div className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 mt-2">
                        {item.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chart 2: Tendon Pain Relief History */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100 font-mono">
                  Curva de Desinflamação & Redução de Dor do Tendão
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">
                Alívio por Isometria THP
              </span>
            </div>

            <div className="h-32 w-full flex items-end justify-between px-4 pt-4">
              {painHistory.map((item, idx) => {
                const heightPct = Math.max(15, (item.pain / 10) * 100);
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center flex-1 h-full justify-end"
                  >
                    <span className="text-[11px] font-mono font-bold text-zinc-300 mb-1">
                      {item.pain}/10
                    </span>
                    <div
                      className={`w-8 rounded-t-md transition-all ${
                        item.pain >= 5
                          ? 'bg-rose-500/30 border border-rose-500/50'
                          : item.pain >= 3
                          ? 'bg-amber-500/30 border border-amber-500/50'
                          : 'bg-emerald-500/30 border border-emerald-500/50'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[10px] font-mono text-zinc-500 mt-2">
                      Sessão {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Radar Chart & Deficit Action Plan (1 Col) */}
        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center">
            <div className="w-full flex items-center justify-between border-b border-zinc-800 pb-3 mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100 font-mono">
                Radar Biomecânico THP
              </h3>
              <button
                onClick={() => onNavigateTab('diagnostic')}
                className="text-[11px] text-emerald-400 hover:underline"
              >
                Refazer Testes
              </button>
            </div>

            <BiomechanicsRadar scores={diagnostic.radarScores} />
          </div>

          {/* Key Prescription Summary */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 space-y-3 text-xs">
            <h4 className="font-mono text-xs font-bold uppercase text-zinc-200 flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Diretrizes do Microciclo</span>
            </h4>

            <div className="space-y-2">
              {diagnostic.actionPlan.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-zinc-400 text-[11px]">
                  <span className="text-emerald-400 font-mono">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-800/80">
              <button
                onClick={() => onNavigateTab('ai')}
                className="w-full inline-flex items-center justify-center space-x-2 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/40 text-zinc-200 text-xs font-medium transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Consultar IA Biomecânica</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT COMPLETED WORKOUTS TABLE */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100 font-mono">
              Histórico de Sessões Concluídas
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            {workoutLogs.length} sessões registradas
          </span>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {workoutLogs.map((log) => (
            <div
              key={log.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-zinc-400 text-[11px]">
                    {log.completedAt}
                  </span>
                  <span className="font-semibold text-zinc-200">
                    {log.workoutTitle}
                  </span>
                </div>
                {log.notes && (
                  <p className="text-zinc-400 text-[11px] mt-0.5">{log.notes}</p>
                )}
              </div>

              <div className="flex items-center space-x-4 self-end sm:self-auto font-mono text-xs">
                <div>
                  <span className="text-zinc-500 text-[10px] block">Duração</span>
                  <span className="text-zinc-300">{log.durationMinutes} min</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">RPE</span>
                  <span className="text-emerald-400 font-bold">
                    {log.overallRpe} / 10
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">Salto Estimado</span>
                  <span className="text-zinc-100 font-bold">
                    {log.perceivedJumpHeightCm ?? user.currentVerticalCm} cm
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
