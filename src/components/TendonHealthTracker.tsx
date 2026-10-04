import { useState } from 'react';
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  HeartPulse,
  Info,
  Play,
  Plus,
  Shield,
  ShieldAlert,
  Sparkles,
  TrendingDown,
} from 'lucide-react';
import { TendonHealthLog } from '../types/thp';

interface TendonHealthTrackerProps {
  tendonLogs: TendonHealthLog[];
  onAddTendonLog: (log: TendonHealthLog) => void;
}

export function TendonHealthTracker({
  tendonLogs,
  onAddTendonLog,
}: TendonHealthTrackerProps) {
  // New Log Form State
  const [showLogForm, setShowLogForm] = useState(false);
  const [tendonLocation, setTendonLocation] = useState<
    'PATELLAR_LEFT' | 'PATELLAR_RIGHT' | 'ACHILLES_LEFT' | 'ACHILLES_RIGHT' | 'QUAD_TENDON'
  >('PATELLAR_RIGHT');
  const [painScore, setPainScore] = useState<number>(3);
  const [morningStiffness, setMorningStiffness] = useState<number>(2);
  const [singleLegSquatPain, setSingleLegSquatPain] = useState<number>(3);
  const [protocol, setProtocol] = useState<string>('Spanish Squat 5x45s hold');
  const [notes, setNotes] = useState<string>('');

  // Interactive 45-Second Analgesic Timer
  const [timerSeconds, setTimerSeconds] = useState(45);
  const [timerRunning, setTimerRunning] = useState(false);

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: TendonHealthLog = {
      id: `tlog_${Date.now()}`,
      loggedAt: new Date().toISOString().split('T')[0],
      tendonLocation,
      painScore,
      morningStiffness,
      singleLegSquatPain,
      protocolFollowed: protocol,
      notes: notes || 'Check-in de monitoramento de dor tendínea.',
    };
    onAddTendonLog(newEntry);
    setShowLogForm(false);
    setNotes('');
  };

  const latestLog = tendonLogs[0];
  const isHighPain = (latestLog?.painScore || 0) >= 4;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-medium">
                PROTOCOLO DE RESILIÊNCIA
              </span>
              <span className="text-zinc-500 text-xs font-mono">
                SAÚDE TENDÍNEA & ANALGESIA
              </span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight mt-1">
              Rastreador de Tendinopatia Patelar & Aquiles
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Protocolos de isometria pesada para alívio imediato da inibição cortical e síntese de colágeno Tipo I.
            </p>
          </div>

          <button
            onClick={() => setShowLogForm(!showLogForm)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-md shadow-emerald-500/10 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Teste de Dor</span>
          </button>
        </div>

        {/* Current Tendon Status Overview Card */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400">Dor Atual (0-10)</span>
              <div className="text-xl font-mono font-bold mt-0.5">
                <span
                  className={
                    isHighPain ? 'text-rose-400' : 'text-emerald-400'
                  }
                >
                  {latestLog?.painScore ?? 0}
                </span>
                <span className="text-zinc-600 text-xs font-normal"> / 10</span>
              </div>
            </div>
            <ShieldAlert
              className={`w-6 h-6 ${
                isHighPain ? 'text-rose-400' : 'text-emerald-400'
              }`}
            />
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400">
                Rigidez Matinal (1-5)
              </span>
              <div className="text-xl font-mono font-bold mt-0.5 text-zinc-100">
                {latestLog?.morningStiffness ?? 1}
                <span className="text-zinc-600 text-xs font-normal"> / 5</span>
              </div>
            </div>
            <Activity className="w-6 h-6 text-zinc-500" />
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400">
                Agachamento Unipodal 90°
              </span>
              <div className="text-xl font-mono font-bold mt-0.5 text-zinc-100">
                {latestLog?.singleLegSquatPain ?? 0}
                <span className="text-zinc-600 text-xs font-normal"> / 10</span>
              </div>
            </div>
            <HeartPulse className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* NEW TENDON LOG FORM (DRAWER) */}
      {showLogForm && (
        <form
          onSubmit={handleSaveLog}
          className="bg-zinc-900/80 border border-emerald-500/30 rounded-2xl p-6 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-zinc-100 font-mono uppercase">
              Novo Registro de Teste de Dor Tendínea
            </h3>
            <button
              type="button"
              onClick={() => setShowLogForm(false)}
              className="text-zinc-400 hover:text-zinc-200 text-xs font-mono"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-zinc-300 mb-1">Localização</label>
              <select
                value={tendonLocation}
                onChange={(e: any) => setTendonLocation(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="PATELLAR_RIGHT">Tendão Patelar Direito</option>
                <option value="PATELLAR_LEFT">Tendão Patelar Esquerdo</option>
                <option value="QUAD_TENDON">Tendão do Quadríceps</option>
                <option value="ACHILLES_RIGHT">Tendão de Aquiles Direito</option>
                <option value="ACHILLES_LEFT">Tendão de Aquiles Esquerdo</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-zinc-300">Escala de Dor (0-10)</label>
                <span className="font-mono text-emerald-400 font-bold">
                  {painScore} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={painScore}
                onChange={(e) => setPainScore(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-zinc-300">
                  Dor no Agachamento Unipodal
                </label>
                <span className="font-mono text-emerald-400 font-bold">
                  {singleLegSquatPain} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={singleLegSquatPain}
                onChange={(e) => setSingleLegSquatPain(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-300 mb-1">
                Protocolo Realizado
              </label>
              <input
                type="text"
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                placeholder="Ex: Spanish Squat 5x45s hold"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 mb-1">Notas & Gatilhos</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Alívio imediato após isometria. Sensação de tendão solto."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-md shadow-emerald-500/20"
            >
              Salvar Entrada
            </button>
          </div>
        </form>
      )}

      {/* GUIDED ISOMETRIC ANALGESIA PROTOCOL (THE HIGHEST POINT STANDARD) */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wide font-mono">
              Protocolo Analgésico Guiado THP (Spanish Squat 45s)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            5 Séries x 45 Segundos @ 70% MVC
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2 space-y-2 text-xs text-zinc-300 leading-relaxed">
            <p>
              <strong className="text-zinc-100">Por que funciona:</strong> A contração isométrica pesada sustentada por 45 segundos produz um efeito analgésico quase imediato (de até 45 minutos) através da inibição cortical de interneurônios, reduzindo a dor durante treinos ou jogos.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-zinc-400">
                <span className="text-emerald-400 font-semibold block mb-0.5">
                  1. Posicionamento
                </span>
                Elástico grosso preso em coluna estável e encaixado na fossa poplítea (atrás dos joelhos).
              </div>
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-zinc-400">
                <span className="text-emerald-400 font-semibold block mb-0.5">
                  2. Ângulo de Apoio
                </span>
                Sente a 70°-80° de flexão com tíbias verticais. Mantenha tronco ereto sem balançar.
              </div>
            </div>
          </div>

          {/* Interactive Timer Box */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex flex-col items-center justify-center space-y-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              Hold Isométrico
            </span>
            <span
              className={`text-3xl font-mono font-bold ${
                timerRunning ? 'text-emerald-400 animate-pulse' : 'text-zinc-200'
              }`}
            >
              00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="px-3 py-1 rounded-lg bg-emerald-500 text-black text-xs font-semibold flex items-center space-x-1"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{timerRunning ? 'Pausar' : 'Iniciar Hold'}</span>
              </button>
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSeconds(45);
                }}
                className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200"
              >
                ↺
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HISTÓRICO DE LOGS TENDÍNEOS */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-zinc-100 font-mono uppercase tracking-wide">
          Histórico de Monitoramento & Evolução da Dor
        </h3>

        <div className="divide-y divide-zinc-800/80">
          {tendonLogs.map((log) => (
            <div
              key={log.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-zinc-400 text-[11px]">
                    {log.loggedAt}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[10px]">
                    {log.tendonLocation.replace('_', ' ')}
                  </span>
                  {log.protocolFollowed && (
                    <span className="text-[11px] text-emerald-400">
                      • {log.protocolFollowed}
                    </span>
                  )}
                </div>
                {log.notes && (
                  <p className="text-zinc-400 text-[11px]">{log.notes}</p>
                )}
              </div>

              <div className="flex items-center space-x-4 self-end sm:self-auto font-mono text-xs">
                <div>
                  <span className="text-zinc-500 text-[10px] block">Dor Geral</span>
                  <span
                    className={`font-bold ${
                      log.painScore >= 4 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {log.painScore} / 10
                  </span>
                </div>

                <div>
                  <span className="text-zinc-500 text-[10px] block">Unipodal</span>
                  <span className="text-zinc-300 font-bold">
                    {log.singleLegSquatPain} / 10
                  </span>
                </div>

                <div>
                  <span className="text-zinc-500 text-[10px] block">Rigidez</span>
                  <span className="text-zinc-300 font-bold">
                    {log.morningStiffness} / 5
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
