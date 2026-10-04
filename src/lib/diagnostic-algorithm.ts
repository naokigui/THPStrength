import { DiagnosticInput, DiagnosticResult, JumpDeficit, ProgramPhase, UserProfile } from '../types/thp';

/**
 * Motor de Diagnóstico Biomecânico THP Strength
 * Baseado no Sistema Conjugado Longo e nos trabalhos de Isaiah Rivera / John Evans.
 */
export function calculateThpDiagnostic(
  user: UserProfile,
  input: DiagnosticInput
): DiagnosticResult {
  const { squatJumpCm, countermovementJumpCm, approachJumpCm, backSquat1RmKg, tendonPainScale } = input;
  const weightKg = user.weightKg > 0 ? user.weightKg : 75;

  // 1. Cálculos de Índices Fisiológicos
  const eurRatio = squatJumpCm > 0 
    ? Number((countermovementJumpCm / squatJumpCm).toFixed(2)) 
    : 1.10;

  const squatBwRatio = weightKg > 0 
    ? Number((backSquat1RmKg / weightKg).toFixed(2)) 
    : 1.5;

  const approachDelta = approachJumpCm - countermovementJumpCm;
  const approachDeficitPct = countermovementJumpCm > 0 
    ? Number(((approachDelta / countermovementJumpCm) * 100).toFixed(1)) 
    : 15.0;

  // 2. Pontuação do Radar de Capacidades (0 a 100)
  // Força Absoluta: 2.2x BW = 100
  const absoluteForce = Math.min(100, Math.max(20, Math.round((squatBwRatio / 2.2) * 100)));

  // Elasticidade / SSC: EUR entre 1.10 e 1.20 é ótimo. Se eur < 1.05 pontua baixo
  let elasticitySsc = 60;
  if (eurRatio < 1.0) {
    elasticitySsc = 35;
  } else if (eurRatio < 1.06) {
    elasticitySsc = 50;
  } else if (eurRatio >= 1.08 && eurRatio <= 1.18) {
    elasticitySsc = 95;
  } else if (eurRatio > 1.25) {
    elasticitySsc = 80;
  } else {
    elasticitySsc = 75;
  }

  // Eficiência Mecânica / Penúltimo passo:
  // Ganho ideal de approach: 15% a 24%
  let approachMechanics = 70;
  if (approachDeficitPct < 5) {
    approachMechanics = 35;
  } else if (approachDeficitPct < 12) {
    approachMechanics = 55;
  } else if (approachDeficitPct >= 14 && approachDeficitPct <= 26) {
    approachMechanics = 92;
  } else {
    approachMechanics = 75;
  }

  // Resiliência do Tendão (escala 0-10 invertida para 0-100)
  const tendonResilience = Math.max(10, Math.round((10 - tendonPainScale) * 10));

  // RFD / Explosão Rápida
  const rateOfForceDev = Math.round((elasticitySsc * 0.6) + (absoluteForce * 0.4));

  // 3. Determinação do Déficit Primário Dominante
  let dominantDeficit: JumpDeficit = 'BALANCED_OPTIMIZED';
  let deficitTitle = 'Perfil Equilibrado / Otimização Conjugada';
  let deficitDescription = 'Equilíbrio sólido entre força máxima, capacidade elástica dos tendões e mecânica do penúltimo passo.';
  let recommendedPhase: ProgramPhase = 'TRANSMUTATION_FORCE';
  let recommendedPhaseTitle = 'Transmutação de Força & Potência Reativa';

  // Lógica de Priorização THP:
  // 1º Verificar Déficit de Técnica (Approach jump não converte velocidade)
  if (approachDeficitPct < 10) {
    dominantDeficit = 'TECHNIQUE_MECHANICAL_DEFICIT';
    deficitTitle = 'Déficit de Técnica & Conversão Mecânica';
    deficitDescription = `Seu salto com corrida adiciona apenas ${approachDeficitPct}% sobre o salto parado (o ideal no THP é entre 15% e 25%). Há vazamento severo de energia cinética na desaceleração do penúltimo passo (penultimate step) ou na colocação do pé de bloqueio (block foot).`;
    recommendedPhase = 'REALIZATION_PEAKING';
    recommendedPhaseTitle = 'Realização & Otimização do Penúltimo Passo';
  } 
  // 2º Se Squat/BW < 1.6x ou EUR > 1.20 -> Força Bruta
  else if (squatBwRatio < 1.6 || eurRatio > 1.22) {
    dominantDeficit = 'FORCE_DEFICIT';
    deficitTitle = 'Déficit de Força Máxima / Base Concêntrica';
    deficitDescription = `Sua relação Agachamento/Peso é de ${squatBwRatio}x (meta THP: 1.8x - 2.2x). Seus músculos extensores (quadríceps, glúteos) não geram impulso concêntrico suficiente no solo para suportar grandes velocidades de decolagem.`;
    recommendedPhase = 'ACCUMULATION_VOLUME';
    recommendedPhaseTitle = 'Acumulação de Força & Adaptação Estrutural';
  } 
  // 3º Se EUR < 1.07 -> Elasticidade / SSC
  else if (eurRatio < 1.07) {
    dominantDeficit = 'ELASTICITY_SSC_DEFICIT';
    deficitTitle = 'Déficit de Elasticidade & Ciclo Alongamento-Encurtamento (SSC)';
    deficitDescription = `Seu índice EUR (CMJ/SJ) é de ${eurRatio} (abaixo do padrão ótimo de 1.10 - 1.15). Seu contramovimento não armazena nem devolve energia elástica nos tendões patelares. Você salta quase como um pistão rígido sem mola elástica.`;
    recommendedPhase = 'TRANSMUTATION_FORCE';
    recommendedPhaseTitle = 'Pliometria Rápida & Rigidez Tendínea (Tendon Stiffness)';
  }

  // Modificador de Tendão (Protocolo Analgésico Mandatório):
  let tendonVulnerabilityScore: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
  if (tendonPainScale >= 5) {
    tendonVulnerabilityScore = 'HIGH';
    deficitDescription += ' [ALERTA TENDÍNEO: Nível de dor patelar elevado. Priorização de isometrias analgésicas pesadas para supressão da inibição cortical motora antes de pliometria agressiva].';
  } else if (tendonPainScale >= 2) {
    tendonVulnerabilityScore = 'MODERATE';
  }

  // 4. Prescrições Específicas do Sistema THP
  const keyPrescriptions = {
    isometricFocus: tendonPainScale >= 3 
      ? 'Spanish Squat Hold (5x45s @ 70% esforço) + Seated Soleus Isometric'
      : 'Overcoming Isometric Squat contra pinos (3x5s Max Intent) + Wall Sit Unilateral',
    strengthFocus: dominantDeficit === 'FORCE_DEFICIT'
      ? 'Back Squat pesado com pausa de 2s (RPE 8.5) + Trap Bar Deadlift concêntrico'
      : 'Agachamento com acomodação de resistência (Band-resisted Squat) a 55-65% 1RM',
    plyoFocus: dominantDeficit === 'ELASTICITY_SSC_DEFICIT'
      ? 'Depth Jumps de 30-45cm com foco em tempo de contato curto (<200ms) + Continuous Pogos'
      : dominantDeficit === 'TECHNIQUE_MECHANICAL_DEFICIT'
      ? 'Penultimate Step Bounds + Salto com 2 passos de corrida gravados a 240fps'
      : 'Pliometria mista reativa + Box Jumps sem contramovimento',
  };

  const actionPlan: string[] = [
    `Frequência: 3 sessões semanais pelo Sistema Conjugado Longo (Max Effort, Dynamic Effort, Reab/Tendon Day).`,
    `Monitoramento de rigidez matinal do tendão através do teste de agachamento unipodal (VISA-P scale).`,
    `Ajuste de volume de salto: máximo de 60-80 contatos pliométricos de alta intensidade por microciclo.`,
    `Sessão pré-jogo obrigatória com protocolo Game Day Priming para potenciação pós-ativação (PAP).`,
  ];

  return {
    id: `diag_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    input,
    eurRatio,
    squatBwRatio,
    approachDeficitPct,
    tendonVulnerabilityScore,
    dominantDeficit,
    deficitTitle,
    deficitDescription,
    recommendedPhase,
    recommendedPhaseTitle,
    radarScores: {
      absoluteForce,
      elasticitySsc,
      approachMechanics,
      tendonResilience,
      rateOfForceDev,
    },
    actionPlan,
    keyPrescriptions,
  };
}
