import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Flame,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { calculateThpDiagnostic } from '../lib/diagnostic-algorithm';
import { BiomechanicsRadar } from './BiomechanicsRadar';
import {
  AthleteType,
  DiagnosticInput,
  DiagnosticResult,
  JumpDominance,
  UserProfile,
} from '../types/thp';

interface DiagnosticWizardProps {
  user: UserProfile;
  currentDiagnostic: DiagnosticResult;
  onSaveDiagnostic: (updatedUser: UserProfile, newResult: DiagnosticResult) => void;
  onGoToWorkouts: () => void;
}

export function DiagnosticWizard({
  user,
  currentDiagnostic,
  onSaveDiagnostic,
  onGoToWorkouts,
}: DiagnosticWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [athleteName, setAthleteName] = useState(user.name);
  const [athleteType, setAthleteType] = useState<AthleteType>(user.athleteType);
  const [jumpDominance, setJumpDominance] = useState<JumpDominance>(user.jumpDominance);
  const [heightCm, setHeightCm] = useState(user.heightCm);
  const [weightKg, setWeightKg] = useState(user.weightKg);
  const [standingReachCm, setStandingReachCm] = useState(user.standingReachCm);
  const [currentVerticalCm, setCurrentVerticalCm] = useState(user.currentVerticalCm);
  const [targetVerticalCm, setTargetVerticalCm] = useState(user.targetVerticalCm);

  // Field Tests State
  const [squatJumpCm, setSquatJumpCm] = useState(currentDiagnostic.input.squatJumpCm);
  const [cmjCm, setCmjCm] = useState(currentDiagnostic.input.countermovementJumpCm);
  const [approachJumpCm, setApproachJumpCm] = useState(currentDiagnostic.input.approachJumpCm);

  // Strength & Tendon State
  const [backSquat1Rm, setBackSquat1Rm] = useState(currentDiagnostic.input.backSquat1RmKg);
  const [trapBarDeadlift, setTrapBarDeadlift] = useState(
    currentDiagnostic.input.trapBarDeadliftKg || Math.round(currentDiagnostic.input.backSquat1RmKg * 1.2)
  );
  const [tendonPain, setTendonPain] = useState(currentDiagnostic.input.tendonPainScale);
  const [primaryNotes, setPrimaryNotes] = useState(
    currentDiagnostic.input.primaryLimiterNotes || ''
  );

  // Calculated Preview
  const tempUser: UserProfile = {
    ...user,
    name: athleteName,
    athleteType,
    jumpDominance,
    heightCm,
    weightKg,
    standingReachCm,
    currentVerticalCm,
    targetVerticalCm,
  };

  const tempInput: DiagnosticInput = {
    standingReachCm,
    squatJumpCm,
    countermovementJumpCm: cmjCm,
    approachJumpCm,
    backSquat1RmKg: backSquat1Rm,
    trapBarDeadliftKg: trapBarDeadlift,
    tendonPainScale: tendonPain,
    weeklyJumpingFrequency: 3,
    primaryLimiterNotes: primaryNotes,
  };

  const previewResult = calculateThpDiagnostic(tempUser, tempInput);

  const handleFinish = () => {
    onSaveDiagnostic(tempUser, previewResult);
    setStep(4);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-medium">
                PROTOCOLO DE AVALIAÇÃO THP
              </span>
              <span className="text-zinc-500 text-xs font-mono">PASSO {step} DE 4</span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight mt-1">
              Diagnóstico de Déficit de Salto & Força
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Identifique se o seu gargalo neuromuscular reside na força máxima, na elasticidade dos tendões (SSC) ou na técnica do penúltimo passo.
            </p>
          </div>

          {/* Step Progress indicators */}
          <div className="flex items-center space-x-2 self-start md:self-auto">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-semibold flex items-center justify-center border transition-all ${
                  step === s
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-500/20'
                    : step > s
                    ? 'bg-zinc-800 text-emerald-400 border-zinc-700'
                    : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content by Step */}
      <div className="bg-zinc-900/50 border border-zinc-800/90 rounded-2xl p-6 shadow-xl">
        {/* STEP 1: Athlete Biometrics */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <h2 className="text-base font-semibold text-zinc-100 flex items-center space-x-2">
                <span className="text-emerald-400 font-mono">01.</span>
                <span>Perfil Biométrico & Modalidade</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                A altura, o peso corporal e a dominância do salto afetam diretamente as alavancas e a carga no solo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Nome do Atleta
                </label>
                <input
                  type="text"
                  value={athleteName}
                  onChange={(e) => setAthleteName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Esporte Principal
                </label>
                <select
                  value={athleteType}
                  onChange={(e) => setAthleteType(e.target.value as AthleteType)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="BASKETBALL">Basquete (Dunks / Rebotes)</option>
                  <option value="VOLLEYBALL">Voleibol (Ataque / Bloqueio)</option>
                  <option value="DUNK_ATHLETE">Atleta Profissional de Dunk</option>
                  <option value="TRACK_FIELD">Atletismo (Salto em Altura/Distância)</option>
                  <option value="HANDBALL">Handebol</option>
                  <option value="SOCCER">Futebol</option>
                  <option value="OTHER">Outro / Geral</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Dominância Preferencial de Salto
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'TWO_FOOT', label: '2 Pés (Double)' },
                    { id: 'ONE_FOOT', label: '1 Pé (Single)' },
                    { id: 'BOTH', label: 'Ambos (Híbrido)' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setJumpDominance(d.id as JumpDominance)}
                      className={`px-3 py-2 text-xs rounded-xl border font-medium transition-all ${
                        jumpDominance === d.id
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/60'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Peso Corporal (kg)
                </label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Altura Corporal (cm)
                </label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Alcance em Pé (Standing Reach - cm)
                </label>
                <input
                  type="number"
                  value={standingReachCm}
                  onChange={(e) => setStandingReachCm(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Salto Vertical Atual (cm)
                </label>
                <input
                  type="number"
                  value={currentVerticalCm}
                  onChange={(e) => setCurrentVerticalCm(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Meta de Salto Vertical (cm)
                </label>
                <input
                  type="number"
                  value={targetVerticalCm}
                  onChange={(e) => setTargetVerticalCm(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-md shadow-emerald-500/10"
              >
                <span>Avançar para Testes de Salto</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Field Jump Tests (SJ, CMJ, Approach) */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <h2 className="text-base font-semibold text-zinc-100 flex items-center space-x-2">
                <span className="text-emerald-400 font-mono">02.</span>
                <span>Testes de Campo (Bateria Biomecânica THP)</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                A comparação entre o salto estático (SJ), o contramovimento (CMJ) e o salto com corrida (Approach) isola a eficiência elástica e a mecânica do penúltimo passo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Squat Jump Card */}
              <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-300">
                    1. SQUAT JUMP (SJ)
                  </span>
                  <span className="text-[10px] text-zinc-500">Sem Contramovimento</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Desça até 90° de joelho, pause por 3 segundos sem balanço e decole puramente com força concêntrica.
                </p>
                <div>
                  <label className="text-[11px] text-zinc-400">Altura Atingida (cm)</label>
                  <input
                    type="number"
                    value={squatJumpCm}
                    onChange={(e) => setSquatJumpCm(Number(e.target.value))}
                    className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Countermovement Jump Card */}
              <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    2. COUNTERMOVEMENT (CMJ)
                  </span>
                  <span className="text-[10px] text-zinc-500">Salto Parado Rápido</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Em pé estático, desça rápido flexionando joelhos e quadris e decole imediatamente usando o reflexo elástico.
                </p>
                <div>
                  <label className="text-[11px] text-zinc-400">Altura Atingida (cm)</label>
                  <input
                    type="number"
                    value={cmjCm}
                    onChange={(e) => setCmjCm(Number(e.target.value))}
                    className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Approach Jump Card */}
              <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-300">
                    3. APPROACH JUMP
                  </span>
                  <span className="text-[10px] text-zinc-500">Com Corrida Máxima</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Aproximação de 2 a 4 passos com penúltimo passo agressivo e uso total de braços para alcance máximo.
                </p>
                <div>
                  <label className="text-[11px] text-zinc-400">Altura Máxima (cm)</label>
                  <input
                    type="number"
                    value={approachJumpCm}
                    onChange={(e) => setApproachJumpCm(Number(e.target.value))}
                    className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Real-time Calculation Badge */}
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-zinc-400">
                  Índice EUR em tempo real (CMJ / SJ)
                </span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-2xl font-mono font-bold text-emerald-400">
                    {previewResult.eurRatio}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {previewResult.eurRatio < 1.05
                      ? '⚠️ Déficit Elástico (Contramovimento não adiciona)'
                      : previewResult.eurRatio > 1.20
                      ? '⚠️ Déficit de Força Base (SJ muito baixo)'
                      : '✅ Faixa Ideal de Elasticidade THP'}
                  </span>
                </div>
              </div>

              <div className="border-t sm:border-t-0 sm:border-l border-zinc-800 sm:pl-4">
                <span className="text-[11px] font-mono uppercase text-zinc-400">
                  Ganho na Corrida (Approach vs CMJ)
                </span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-2xl font-mono font-bold text-zinc-100">
                    +{previewResult.approachDeficitPct}%
                  </span>
                  <span className="text-xs text-zinc-400">
                    {previewResult.approachDeficitPct < 10
                      ? '⚠️ Perda no Penúltimo Passo'
                      : '✅ Boa conversão'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 text-xs font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-md shadow-emerald-500/10"
              >
                <span>Avançar para Força & Tendão</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Strength & Tendon Pain */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <h2 className="text-base font-semibold text-zinc-100 flex items-center space-x-2">
                <span className="text-emerald-400 font-mono">03.</span>
                <span>Força Máxima & Saúde Tendínea</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Na metodologia THP Strength, a força absoluta do agachamento (1.8x a 2.2x BW) e a saúde do tendão patelar ditam se você pode realizar pliometria pesada sem risco de lesão.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  1RM Back Squat (Agachamento Livre - kg)
                </label>
                <input
                  type="number"
                  value={backSquat1Rm}
                  onChange={(e) => setBackSquat1Rm(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Relação estimada atual:{' '}
                  <span className="font-mono text-emerald-400 font-semibold">
                    {previewResult.squatBwRatio}x
                  </span>{' '}
                  do peso corporal (Meta THP: 2.0x).
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  1RM Trap Bar Deadlift ou Puxada (kg) [Opcional]
                </label>
                <input
                  type="number"
                  value={trapBarDeadlift}
                  onChange={(e) => setTrapBarDeadlift(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Avalia a capacidade de produção de força posterior e rigidez espinhal.
                </p>
              </div>
            </div>

            {/* Tendon Pain Slider */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-zinc-200">
                    Escala de Dor no Tendão Patelar ou Aquiles (0 a 10)
                  </span>
                  <p className="text-[11px] text-zinc-400">
                    Dor percebida no agachamento unipodal a 90 graus ou no dia seguinte a treinos de salto.
                  </p>
                </div>
                <span
                  className={`text-xl font-mono font-bold px-3 py-1 rounded-lg border ${
                    tendonPain >= 5
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : tendonPain >= 3
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {tendonPain} / 10
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={tendonPain}
                onChange={(e) => setTendonPain(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
              />

              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>0 = Tendão Blindado</span>
                <span>3 = Desconforto Leve</span>
                <span>6 = Dor Moderada (Pliometria Limitada)</span>
                <span>10 = Tendinopatia Aguda</span>
              </div>

              {tendonPain >= 3 && (
                <div className="flex items-start space-x-2 text-xs bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Aviso THP: Nível de desconforto tendíneo detectado. O programa incluirá automaticamente o protocolo isométrico analgésico de Spanish Squats (45s holds) para inibição cortical e alívio da dor.
                  </span>
                </div>
              )}
            </div>

            {/* Observations */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Observações do Atleta / Sensação de Salto
              </label>
              <textarea
                rows={2}
                value={primaryNotes}
                onChange={(e) => setPrimaryNotes(e.target.value)}
                placeholder="Ex: Sinto que travo no penúltimo passo, ou sinto o joelho ranger ao aterrissar..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 text-xs font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-md shadow-emerald-500/10"
              >
                <Sparkles className="w-4 h-4" />
                <span>Gerar Diagnóstico THP</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Diagnosis & Prescriptions Output */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4 flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-medium">
                  DIAGNÓSTICO CONCLUÍDO
                </span>
                <h2 className="text-xl font-bold text-zinc-100 mt-1">
                  {previewResult.deficitTitle}
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Fase Recomendada:{' '}
                  <span className="text-emerald-400 font-medium">
                    {previewResult.recommendedPhaseTitle}
                  </span>
                </p>
              </div>

              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refazer Testes</span>
              </button>
            </div>

            {/* Deficit Detailed Description */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-300 leading-relaxed">
              {previewResult.deficitDescription}
            </div>

            {/* Radar & Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Radar Chart */}
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 flex flex-col items-center">
                <span className="text-[11px] font-mono uppercase text-zinc-400 self-start">
                  Radar Neuromuscular THP
                </span>
                <BiomechanicsRadar scores={previewResult.radarScores} />
              </div>

              {/* Metric Breakdown */}
              <div className="space-y-3">
                <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-400">
                      Índice EUR (CMJ / SJ)
                    </span>
                    <p className="text-xs text-zinc-300 mt-0.5">
                      {previewResult.eurRatio < 1.05
                        ? 'Déficit Elástico / Falta de mola tendínea'
                        : 'Equilíbrio elástico favorável'}
                    </p>
                  </div>
                  <span className="text-lg font-mono font-bold text-emerald-400">
                    {previewResult.eurRatio}
                  </span>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-400">
                      Relação Agachamento / Peso
                    </span>
                    <p className="text-xs text-zinc-300 mt-0.5">
                      {previewResult.squatBwRatio < 1.6
                        ? 'Base concêntrica insuficiente (< 1.6x)'
                        : 'Excelente força de impulsão (> 1.8x)'}
                    </p>
                  </div>
                  <span className="text-lg font-mono font-bold text-zinc-100">
                    {previewResult.squatBwRatio}x
                  </span>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-400">
                      Ganho no Penúltimo Passo
                    </span>
                    <p className="text-xs text-zinc-300 mt-0.5">
                      {previewResult.approachDeficitPct < 10
                        ? 'Vazamento de energia horizontal'
                        : 'Boa alavanca vetorial'}
                    </p>
                  </div>
                  <span className="text-lg font-mono font-bold text-emerald-400">
                    +{previewResult.approachDeficitPct}%
                  </span>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-400">
                      Vulnerabilidade do Tendão
                    </span>
                    <p className="text-xs text-zinc-300 mt-0.5">
                      {previewResult.tendonVulnerabilityScore === 'HIGH'
                        ? 'Protocolo isométrico analgésico mandatório'
                        : 'Tolerância normal ao impacto'}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                      previewResult.tendonVulnerabilityScore === 'HIGH'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {previewResult.tendonVulnerabilityScore}
                  </span>
                </div>
              </div>
            </div>

            {/* Prescriptions */}
            <div className="bg-zinc-950 border border-zinc-800/90 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-mono uppercase text-zinc-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Prescrição Chave do Sistema Conjugado Longo THP</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-lg">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase">
                    1. Isometria & Tendão
                  </span>
                  <p className="text-xs text-zinc-200 mt-1 font-medium">
                    {previewResult.keyPrescriptions.isometricFocus}
                  </p>
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-lg">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase">
                    2. Força / Potência
                  </span>
                  <p className="text-xs text-zinc-200 mt-1 font-medium">
                    {previewResult.keyPrescriptions.strengthFocus}
                  </p>
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-lg">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase">
                    3. Pliometria / SSC
                  </span>
                  <p className="text-xs text-zinc-200 mt-1 font-medium">
                    {previewResult.keyPrescriptions.plyoFocus}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onGoToWorkouts}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Abrir Treino do Dia no Motor Conjugado</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
