import { useEffect, useState } from 'react';
import {
  Activity,
  Bot,
  Calendar,
  CheckCircle,
  ChevronRight,
  Flame,
  Lightbulb,
  Loader2,
  RefreshCw,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import { AiBiomechanicalAnalysis, DiagnosticResult, UserProfile } from '../types/thp';

interface AiBiomechanicsModalProps {
  user: UserProfile;
  diagnostic: DiagnosticResult;
}

export function AiBiomechanicsModal({ user, diagnostic }: AiBiomechanicsModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<AiBiomechanicalAnalysis | null>(null);
  const [source, setSource] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fetchAiAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/analyze-jump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, diagnostic }),
      });

      if (!response.ok) {
        throw new Error('Falha ao comunicar com o servidor de IA.');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
      setSource(data.source || 'gemini-3.8-flash');
    } catch (err: any) {
      console.error(err);
      setError('Não foi possível carregar a análise da IA. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!analysis) {
      fetchAiAnalysis();
    }
  }, [user.id, diagnostic.id]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-medium flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>GOOGLE GEN AI (GEMINI 3.8 FLASH)</span>
              </span>
              <span className="text-zinc-500 text-xs font-mono">
                SISTEMA THP STRENGTH
              </span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight mt-1">
              Consultor Biomecânico de Salto & IA
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Diagnóstico avançado por Inteligência Artificial sintetizando seus índices EUR ({diagnostic.eurRatio}), Agachamento/Peso ({diagnostic.squatBwRatio}x) e saúde dos tendões.
            </p>
          </div>

          <button
            onClick={fetchAiAnalysis}
            disabled={loading}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-medium transition-all self-start sm:self-auto disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            ) : (
              <RefreshCw className="w-4 h-4 text-emerald-400" />
            )}
            <span>Reanalisar Perfil</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-xs font-mono text-zinc-300">
            Processando curvas de força-velocidade e biomecânica do salto...
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-xs text-rose-300 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchAiAnalysis}
            className="underline font-semibold ml-2 hover:text-white"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-emerald-400" />
                <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wide font-mono">
                  Síntese Biomecânica Executiva
                </h2>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                Origem: {source}
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-normal">
              {analysis.athleteSummary}
            </p>
          </div>

          {/* Deep Physiological Breakdown & Neuromuscular Curve */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Activity className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono">
                  Análise Detalhada do Déficit THP
                </h3>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {analysis.primaryDeficitDetailed}
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Zap className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono">
                  Curva Força-Velocidade & Mola Tendínea
                </h3>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {analysis.neuroMuscularProfile}
              </p>
            </div>
          </div>

          {/* Tendon Care Strategy */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Shield className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono">
                Estratégia de Resiliência do Tendão Patelar/Aquiles
              </h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {analysis.tendonCareStrategy}
            </p>
          </div>

          {/* 4-Week Microcycle Outline */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide font-mono">
                Planejamento de 4 Semanas do Sistema Conjugado
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {analysis.fourWeekMicrocycleOutline?.map((weekPlan, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 space-y-1.5"
                >
                  <span className="text-[11px] font-mono font-bold text-emerald-400">
                    BLOCO 0{idx + 1}
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {weekPlan}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Coach Cues */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Lightbulb className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wide font-mono">
                Dicas de Execução Verbal (Coach Cues THP)
              </h3>
            </div>

            <div className="space-y-2">
              {analysis.coachCues?.map((cue, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs text-zinc-300"
                >
                  <span className="font-mono text-emerald-400 font-bold shrink-0">
                    #{idx + 1}
                  </span>
                  <span>{cue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
