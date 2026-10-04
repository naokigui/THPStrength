import { calculateThpDiagnostic } from './diagnostic-algorithm';
import { THP_WORKOUT_DATABASE } from './workout-database';
import {
  DiagnosticInput,
  DiagnosticResult,
  TendonHealthLog,
  UserProfile,
  WorkoutLogEntry,
  WorkoutSession,
} from '../types/thp';

const USER_KEY = 'thp_jump_os_user';
const DIAGNOSTIC_KEY = 'thp_jump_os_diagnostic';
const WORKOUT_LOGS_KEY = 'thp_jump_os_workout_logs';
const TENDON_LOGS_KEY = 'thp_jump_os_tendon_logs';

export const INITIAL_USER: UserProfile = {
  id: 'usr_thp_001',
  name: 'Marcus Silva',
  email: 'marcus.athlete@thpjump.io',
  athleteType: 'BASKETBALL',
  jumpDominance: 'TWO_FOOT',
  heightCm: 188,
  weightKg: 82,
  standingReachCm: 245,
  currentVerticalCm: 81, // 32 inches
  targetVerticalCm: 96,  // 38 inches
  createdAt: '2026-08-15',
};

export const INITIAL_DIAGNOSTIC_INPUT: DiagnosticInput = {
  standingReachCm: 245,
  squatJumpCm: 68,
  countermovementJumpCm: 76,
  approachJumpCm: 81,
  backSquat1RmKg: 135,
  trapBarDeadliftKg: 160,
  tendonPainScale: 3,
  weeklyJumpingFrequency: 3,
  primaryLimiterNotes: 'Sinto que perco altura ao tentar correr mais rápido no penúltimo passo e tenho leve pontada no tendão patelar direito após jogos pesados.',
};

export const INITIAL_TENDON_LOGS: TendonHealthLog[] = [
  {
    id: 'tlog_1',
    loggedAt: '2026-09-12',
    tendonLocation: 'PATELLAR_RIGHT',
    painScore: 6,
    morningStiffness: 4,
    singleLegSquatPain: 5,
    protocolFollowed: 'Spanish Squat 5x45s hold',
    notes: 'Muita dor após torneio de fim de semana.',
  },
  {
    id: 'tlog_2',
    loggedAt: '2026-09-19',
    tendonLocation: 'PATELLAR_RIGHT',
    painScore: 5,
    morningStiffness: 3,
    singleLegSquatPain: 4,
    protocolFollowed: 'Single-Leg Extension Hold + Wall Sit',
    notes: 'Alívio perceptível após 3 dias consecutivos de isometria.',
  },
  {
    id: 'tlog_3',
    loggedAt: '2026-09-26',
    tendonLocation: 'PATELLAR_RIGHT',
    painScore: 3,
    morningStiffness: 2,
    singleLegSquatPain: 3,
    protocolFollowed: 'Spanish Squat Hold com sobrecarga de 15kg',
    notes: 'Dor controlada, tolerando pliometria submáxima sem reatividade negativa.',
  },
  {
    id: 'tlog_4',
    loggedAt: '2026-10-02',
    tendonLocation: 'PATELLAR_RIGHT',
    painScore: 2,
    morningStiffness: 1,
    singleLegSquatPain: 2,
    protocolFollowed: 'Isometria analgésica pré-treino de Max Effort',
    notes: 'Tendão tolerando muito bem as cargas do agachamento livre.',
  },
];

export const INITIAL_WORKOUT_LOGS: WorkoutLogEntry[] = [
  {
    id: 'wlog_1',
    workoutId: 'thp_max_effort_lower',
    workoutTitle: 'Conjugado Longo: Max Effort Lower',
    completedAt: '2026-09-25',
    durationMinutes: 62,
    overallRpe: 8.5,
    perceivedJumpHeightCm: 80,
    tendonDiscomfort: 3,
    notes: 'Agachamento com pausa de 2s subiu forte com 120kg. Boa sensação.',
  },
  {
    id: 'wlog_2',
    workoutId: 'thp_dynamic_effort_ssc',
    workoutTitle: 'Conjugado Longo: Dynamic Effort & SSC',
    completedAt: '2026-09-28',
    durationMinutes: 54,
    overallRpe: 8.0,
    perceivedJumpHeightCm: 81,
    tendonDiscomfort: 2,
    notes: 'Continuous pogos muito rápidos. Contato seco e leve no solo.',
  },
  {
    id: 'wlog_3',
    workoutId: 'thp_technique_penultimate',
    workoutTitle: 'Mecânica do Salto: Penultimate Step Mastery',
    completedAt: '2026-10-01',
    durationMinutes: 48,
    overallRpe: 7.5,
    perceivedJumpHeightCm: 82,
    tendonDiscomfort: 2,
    notes: 'Foquei em afundar mais o quadril no penúltimo passo. Toquei no aro com facilidade.',
  },
];

export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') return INITIAL_USER;
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : INITIAL_USER;
  } catch {
    return INITIAL_USER;
  }
}

export function saveUserProfile(user: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getDiagnosticResult(): DiagnosticResult {
  const user = getUserProfile();
  if (typeof window === 'undefined') {
    return calculateThpDiagnostic(user, INITIAL_DIAGNOSTIC_INPUT);
  }
  try {
    const data = localStorage.getItem(DIAGNOSTIC_KEY);
    if (data) {
      return JSON.parse(data);
    }
    const initialResult = calculateThpDiagnostic(user, INITIAL_DIAGNOSTIC_INPUT);
    saveDiagnosticResult(initialResult);
    return initialResult;
  } catch {
    return calculateThpDiagnostic(user, INITIAL_DIAGNOSTIC_INPUT);
  }
}

export function saveDiagnosticResult(result: DiagnosticResult): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DIAGNOSTIC_KEY, JSON.stringify(result));
}

export function getWorkoutLogs(): WorkoutLogEntry[] {
  if (typeof window === 'undefined') return INITIAL_WORKOUT_LOGS;
  try {
    const data = localStorage.getItem(WORKOUT_LOGS_KEY);
    return data ? JSON.parse(data) : INITIAL_WORKOUT_LOGS;
  } catch {
    return INITIAL_WORKOUT_LOGS;
  }
}

export function addWorkoutLog(log: WorkoutLogEntry): void {
  if (typeof window === 'undefined') return;
  const current = getWorkoutLogs();
  const updated = [log, ...current];
  localStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(updated));
}

export function getTendonLogs(): TendonHealthLog[] {
  if (typeof window === 'undefined') return INITIAL_TENDON_LOGS;
  try {
    const data = localStorage.getItem(TENDON_LOGS_KEY);
    return data ? JSON.parse(data) : INITIAL_TENDON_LOGS;
  } catch {
    return INITIAL_TENDON_LOGS;
  }
}

export function addTendonLog(log: TendonHealthLog): void {
  if (typeof window === 'undefined') return;
  const current = getTendonLogs();
  const updated = [log, ...current];
  localStorage.setItem(TENDON_LOGS_KEY, JSON.stringify(updated));
}

export function getPrescribedWorkoutForDeficit(deficit: string): WorkoutSession {
  const match = THP_WORKOUT_DATABASE.find(w => w.targetDeficit === deficit);
  return match || THP_WORKOUT_DATABASE[0];
}
