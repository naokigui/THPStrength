import { Activity, Flame, ShieldAlert, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { DiagnosticResult, UserProfile } from '../types/thp';

interface NavbarProps {
  user: UserProfile;
  diagnostic: DiagnosticResult;
  activeTab: 'dashboard' | 'diagnostic' | 'workouts' | 'tendons' | 'ai';
  setActiveTab: (tab: 'dashboard' | 'diagnostic' | 'workouts' | 'tendons' | 'ai') => void;
  openPrimingModal: () => void;
}

export function Navbar({
  user,
  diagnostic,
  activeTab,
  setActiveTab,
  openPrimingModal,
}: NavbarProps) {
  const isTendonAlert = (diagnostic.input?.tendonPainScale || 0) >= 3;

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Method Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Zap className="w-5 h-5 text-emerald-400" strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-base font-bold tracking-tight text-zinc-100">
                  THP <span className="text-emerald-400">JUMP OS</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  CONJUGATE v3.4
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                The Highest Point Strength System
              </p>
            </div>
          </div>

          {/* Athlete Quick Status Pill */}
          <div className="hidden lg:flex items-center space-x-3 text-xs bg-zinc-900/60 border border-zinc-800/80 px-3 py-1.5 rounded-full">
            <span className="text-zinc-400">Atleta:</span>
            <span className="font-medium text-zinc-200">{user.name}</span>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-400">Salto:</span>
            <span className="font-mono font-bold text-emerald-400">
              {user.currentVerticalCm} cm
            </span>
            <span className="text-zinc-600">→</span>
            <span className="font-mono text-zinc-400">{user.targetVerticalCm} cm</span>

            {isTendonAlert && (
              <>
                <span className="text-zinc-700">|</span>
                <span className="inline-flex items-center space-x-1 text-amber-400 text-[11px]">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Tendão {diagnostic.input.tendonPainScale}/10</span>
                </span>
              </>
            )}
          </div>

          {/* Navigation Controls & Game Day Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={openPrimingModal}
              className="relative inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold tracking-wide transition-all shadow-sm hover:shadow-emerald-500/20 active:scale-95"
            >
              <Flame className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="uppercase">Game Day Priming</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-zinc-800/40 text-xs font-medium">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostic')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'diagnostic'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Diagnóstico de Déficit</span>
          </button>

          <button
            onClick={() => setActiveTab('workouts')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'workouts'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Motor de Treino Conjugado</span>
          </button>

          <button
            onClick={() => setActiveTab('tendons')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'tendons'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span>Saúde do Tendão (Isometria)</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'ai'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Análise IA THP</span>
          </button>
        </div>
      </div>
    </header>
  );
}
