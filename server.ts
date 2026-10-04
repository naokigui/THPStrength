import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google Gen AI SDK
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Error initializing GoogleGenAI:', err);
  }
}

// API: AI Biomechanical & THP Strength Analysis
app.post('/api/ai/analyze-jump', async (req: Request, res: Response) => {
  try {
    const { user, diagnostic } = req.body;

    if (!user || !diagnostic) {
      return res.status(400).json({ error: 'Dados incompletos para análise.' });
    }

    // Prompt enriquecido com a metodologia THP Strength
    const promptText = `
Você é o Treinador-Chefe e Especialista em Biomecânica da metodologia THP Strength (The Highest Point - Isaiah Rivera / John Evans).
Analise com profundidade o perfil neuromuscular deste atleta de salto vertical e forneça uma prescrição técnica precisa no formato JSON.

Dados do Atleta:
- Nome: ${user.name}
- Esporte: ${user.athleteType}
- Dominância: ${user.jumpDominance}
- Altura: ${user.heightCm} cm | Peso: ${user.weightKg} kg
- Salto Vertical Atual: ${user.currentVerticalCm} cm (Meta: ${user.targetVerticalCm} cm)

Resultados dos Testes Biomecânicos THP:
- Squat Jump (SJ - estático 90° sem contramovimento): ${diagnostic.input?.squatJumpCm} cm
- Countermovement Jump (CMJ - salto parado com contramovimento): ${diagnostic.input?.countermovementJumpCm} cm
- Approach Jump (Salto máximo com corrida): ${diagnostic.input?.approachJumpCm} cm
- 1RM Back Squat: ${diagnostic.input?.backSquat1RmKg} kg
- Relação Squat / Peso Corporal: ${diagnostic.squatBwRatio}x
- Eccentric Utilization Ratio (EUR = CMJ / SJ): ${diagnostic.eurRatio} (Meta ideal: 1.10 a 1.18)
- Ganho de Corrida (Approach Deficit %): ${diagnostic.approachDeficitPct}% (Meta ideal: +15% a +25%)
- Escala de Dor no Tendão Patelar/Aquiles: ${diagnostic.input?.tendonPainScale} / 10
- Déficit Diagnosticado: ${diagnostic.dominantDeficit} (${diagnostic.deficitTitle})

Diretrizes da Metodologia THP:
1. Se EUR < 1.07: Déficit Elástico/SSC. O atleta salta como um pistão rígido e dissipa energia elástica.
2. Se Squat/BW < 1.6x: Déficit de Força Absoluta. Falta base para suportar altas desacelerações.
3. Se Approach Deficit < 10%: Déficit Mecânico. Problema crônico no Penultimate Step (penúltimo passo rebaixado) e no Block Foot.
4. Se Dor no Tendão >= 3: Obrigatório protocolo isométrico analgésico pesado (Spanish Squats / Wall Sit 5x45s) antes de pliometria de alta intensidade.

Gere uma resposta em JSON com o seguinte schema exato:
{
  "athleteSummary": "Resumo executivo do perfil neuromuscular em 2 a 3 frases",
  "primaryDeficitDetailed": "Explicação fisiológica detalhada do déficit diagnosticado sob a ótica THP",
  "neuroMuscularProfile": "Classificação da curva Força-Velocidade e do aproveitamento da energia elástica tendínea",
  "tendonCareStrategy": "Protocolo específico de isometria e dosagem de impacto para preservação e remodelamento de colágeno",
  "fourWeekMicrocycleOutline": [
    "Semana 1: Foco e prescrição principal",
    "Semana 2: Sobrecarga e variação do sistema conjugado",
    "Semana 3: Pico de intensidade / realização",
    "Semana 4: Deload regenerativo e teste de prontidão"
  ],
  "coachCues": [
    "Dica verbal 1 para o penúltimo passo ou decolagem",
    "Dica verbal 2 para a isometria ou agachamento",
    "Dica verbal 3 para a recuperação tendínea"
  ]
}
Retorne APENAS o JSON válido sem marcações markdown como \`\`\`json.
`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptText,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text?.trim() || '';
        const parsed = JSON.parse(rawText);
        return res.json({ analysis: parsed, source: 'gemini-3.8-flash' });
      } catch (geminiError) {
        console.warn('Fallback to local THP rule engine:', geminiError);
      }
    }

    // Fallback inteligente com as regras biomecânicas exatas da metodologia THP
    const isTendonCritical = (diagnostic.input?.tendonPainScale || 0) >= 3;
    const fallbackAnalysis = {
      athleteSummary: `${user.name} apresenta um perfil clássico com ${diagnostic.deficitTitle.toLowerCase()}. A altura de salto atual (${user.currentVerticalCm} cm) tem potencial imediato de expansão para ${user.targetVerticalCm} cm com a correção do equilíbrio força-elasticidade no Sistema Conjugado.`,
      primaryDeficitDetailed: diagnostic.dominantDeficit === 'ELASTICITY_SSC_DEFICIT'
        ? `Seu índice EUR de ${diagnostic.eurRatio} revela que o ciclo de alongamento-encurtamento (SSC) está subutilizado. Seus tendões estão dissipando energia mecânica como calor em vez de convertê-la em recuo elástico imediato nos últimos 150 milissegundos de contato.`
        : diagnostic.dominantDeficit === 'FORCE_DEFICIT'
        ? `Com uma relação Agachamento/Peso de ${diagnostic.squatBwRatio}x, sua musculatura extensora do joelho e quadril não gera impulso vertical de decolagem compatível com a velocidade da aproximação.`
        : `Seu salto com corrida adiciona apenas ${diagnostic.approachDeficitPct}% sobre o salto parado. O vetor horizontal de velocidade não está sendo transladado para o vetor vertical devido a um penúltimo passo curto ou pé de frenagem desalinhado.`,
      neuroMuscularProfile: `Curva Força-Velocidade desviada para ${diagnostic.dominantDeficit === 'FORCE_DEFICIT' ? 'Velocidade (necessita deslocamento de força base para a esquerda)' : 'Força lenta (necessita aceleração máxima RFD e pliometria de choque)'}.`,
      tendonCareStrategy: isTendonCritical
        ? 'Protocolo analgésico de Spanish Squats pesados (5x45s hold com 2min de descanso) antes de qualquer sessão e restrição de drop jumps acima de 30cm.'
        : 'Manutenção de rigidez tendínea através de isometrias com calcanhar elevado e continuous ankling 2x na semana.',
      fourWeekMicrocycleOutline: [
        'Semana 1 (Adaptação Estrutural): Acumulação de volume em Spanish Squats e agachamento com pausa de 2s a 80% 1RM.',
        'Semana 2 (Potenciação Neural): Introdução de Accommodating Resistance (elásticos) e Depth Jumps controlados de 30cm.',
        'Semana 3 (Pico de Intensidade): Complexos de contraste (Overcoming Isometric Squat seguido de Max Approach Jump).',
        'Semana 4 (Realização e Deload): Redução de 45% do volume pliométrico, manutenção de intensidade e re-teste de salto vertical.',
      ],
      coachCues: [
        'No penúltimo passo, "afunde os quadris e deixe o pé da frente ser a âncora que joga seu peito para o céu".',
        'Nas isometrias de tendão, "pressione o chão com força constante e respire pelo diafragma sem perder a tensão".',
        'Nas decolagens, "pense em atacar o solo em vez de esperar o solo te receber".',
      ],
    };

    return res.json({ analysis: fallbackAnalysis, source: 'thp-rules-engine' });
  } catch (error) {
    console.error('Erro na análise:', error);
    return res.status(500).json({ error: 'Erro interno ao processar diagnóstico.' });
  }
});

// Configure Vite integration for dev or static serving for prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`THP Jump OS server running on port ${port}`);
  });
}

startServer();
