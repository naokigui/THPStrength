export type AthleteType =
  | 'BASKETBALL'
  | 'VOLLEYBALL'
  | 'TRACK_FIELD'
  | 'DUNK_ATHLETE'
  | 'HANDBALL'
  | 'SOCCER'
  | 'OTHER';

export type JumpDominance = 'ONE_FOOT' | 'TWO_FOOT' | 'BOTH';

export type JumpDeficit =
  | 'FORCE_DEFICIT'
  | 'ELASTICITY_SSC_DEFICIT'
  | 'TECHNIQUE_MECHANICAL_DEFICIT'
  | 'BALANCED_OPTIMIZED';

export type ProgramPhase =
  | 'ACCUMULATION_VOLUME'
  | 'TRANSMUTATION_FORCE'
  | 'REALIZATION_PEAKING'
  | 'PRIMING_GAME_DAY';

export type ExerciseCategory =
  | 'TENDON_ISOMETRIC'
  | 'MAX_STRENGTH'
  | 'DYNAMIC_POWER'
  | 'PLYOMETRIC_SSC'
  | 'PRIMING_POTENTIATION'
  | 'CORE_POSTURE';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  athleteType: AthleteType;
  jumpDominance: JumpDominance;
  heightCm: number;
  weightKg: number;
  standingReachCm: number;
  currentVerticalCm: number;
  targetVerticalCm: number;
  createdAt: string;
}

export interface DiagnosticInput {
  standingReachCm: number;
  squatJumpCm: number;             // SJ: Salto estático sem contramovimento (90 graus)
  countermovementJumpCm: number;   // CMJ: Salto com contramovimento padrão
  approachJumpCm: number;          // Salto máximo com corrida de aproximação
  backSquat1RmKg: number;          // 1RM estimada de Back Squat
  trapBarDeadliftKg?: number;      // 1RM Trap bar deadlift (opcional)
  tendonPainScale: number;         // 0 - 10 escala de dor patelar/aquiles
  weeklyJumpingFrequency: number;  // Sessões de salto intenso por semana
  primaryLimiterNotes?: string;
}

export interface DiagnosticResult {
  id: string;
  date: string;
  input: DiagnosticInput;
  // Biomechanical Calculations
  eurRatio: number;                // CMJ / SJ (Alvo: 1.10 - 1.15)
  squatBwRatio: number;            // Squat / Peso Corporal (Alvo: 2.0x+)
  approachDeficitPct: number;      // ((Approach - CMJ) / CMJ) * 100 (Alvo: 15% - 25%)
  estimatedContactTimeMs?: number; // Ex: 160-220ms
  tendonVulnerabilityScore: 'LOW' | 'MODERATE' | 'HIGH';
  
  // Classificações THP
  dominantDeficit: JumpDeficit;
  deficitTitle: string;
  deficitDescription: string;
  recommendedPhase: ProgramPhase;
  recommendedPhaseTitle: string;
  
  // Pilares do Radar (0 a 100)
  radarScores: {
    absoluteForce: number;      // Força Máxima
    elasticitySsc: number;      // Capacidade Elástica / SSC
    approachMechanics: number;  // Eficiência Mecânica / Penúltimo passo
    tendonResilience: number;   // Saúde e Tolerância dos Tendões
    rateOfForceDev: number;     // RFD / Explosão Rápida
  };

  actionPlan: string[];
  keyPrescriptions: {
    isometricFocus: string;
    strengthFocus: string;
    plyoFocus: string;
  };
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  sets: number;
  reps: string;
  tempo?: string;
  restSeconds: number;
  targetRpe: number;
  cues: string;
  videoUrl?: string;
  tendonFriendly: boolean;
  intensityLevel?: 'Submaximal' | 'High' | 'Max Effort';
}

export interface WorkoutSession {
  id: string;
  title: string;
  subtitle: string;
  phase: ProgramPhase;
  dayType: string;
  targetDeficit: JumpDeficit;
  estimatedMinutes: number;
  intensityDescription: string;
  exercises: Exercise[];
  rationale: string;
}

export interface WorkoutLogEntry {
  id: string;
  workoutId: string;
  workoutTitle: string;
  completedAt: string;
  durationMinutes: number;
  overallRpe: number;
  perceivedJumpHeightCm?: number;
  tendonDiscomfort: number; // 0-10
  notes?: string;
}

export interface TendonHealthLog {
  id: string;
  loggedAt: string;
  tendonLocation: 'PATELLAR_LEFT' | 'PATELLAR_RIGHT' | 'ACHILLES_LEFT' | 'ACHILLES_RIGHT' | 'QUAD_TENDON';
  painScore: number;          // 0-10
  morningStiffness: number;   // 1-5
  singleLegSquatPain: number; // 0-10
  protocolFollowed?: string;
  notes?: string;
}

export interface PrimingExercise {
  id: string;
  name: string;
  phase: 'THERMAL_PULSE' | 'TENDON_ANALGESIA' | 'NEURAL_OVERCOMING' | 'PAP_POTENTIATION';
  durationSeconds?: number;
  sets: number;
  repsOrHold: string;
  purpose: string;
  instructions: string;
}

export interface AiBiomechanicalAnalysis {
  athleteSummary: string;
  primaryDeficitDetailed: string;
  neuroMuscularProfile: string;
  tendonCareStrategy: string;
  fourWeekMicrocycleOutline: string[];
  coachCues: string[];
}
