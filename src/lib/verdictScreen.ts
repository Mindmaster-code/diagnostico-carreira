import type { Answers } from '../types/answers';
import { computeGapScore, getTopThreeIssueKeys, salaryWeight, type IssueKey } from './verdict';

/** Todos os cards de risco usam o mesmo peso visual (alerta forte). */
export type RiskCardTone = 'critical';

export type RiskCardIcon = 'promo' | 'lead' | 'interview' | 'salary' | 'traction' | 'proof' | 'linkedin';

export interface RiskStatusCard {
  id: string;
  label: string;
  status: string;
  tone: RiskCardTone;
  icon: RiskCardIcon;
}

export interface CorrectionCardView {
  title: string;
  body: string;
}

export interface VerdictScreenModel {
  headline: string;
  subhead: string;
  riskCards: [RiskStatusCard, RiskStatusCard, RiskStatusCard];
  alertClaim: string;
  alertBullets: [string, string, string];
  consequenceBullets: [string, string, string];
  correctionCards: [CorrectionCardView, CorrectionCardView, CorrectionCardView];
  goodNewsBody: string;
}

type CardId = 'promo' | 'lead' | 'interview' | 'salary' | 'traction' | 'proof';

const CARD_LIBRARY: Record<CardId, { label: string; status: string }> = {
  promo: {
    label: 'PROMOÇÃO',
    status: 'Quando surge vaga melhor, você não é dos primeiros lembrados',
  },
  lead: {
    label: 'LIDERANÇA',
    status: 'Seu perfil passa mais ideia de executor do que de quem conduz',
  },
  interview: {
    label: 'ENTREVISTA',
    status: 'Numa conversa exigente, você ainda corre risco de se expor demais',
  },
  salary: {
    label: 'SALÁRIO',
    status: 'O patamar que você quer não parece sustentado pelo que mostra hoje',
  },
  traction: {
    label: 'VAGAS NO SEU NÍVEL',
    status: 'Quase ninguém te chama para cargo equivalente ao que você busca',
  },
  proof: {
    label: 'LINKEDIN',
    status: 'Quem olha não entende com clareza o que você entrega de fato',
  },
};

function issueKeyToCardId(key: IssueKey): CardId {
  switch (key) {
    case 'visibility':
    case 'positioning':
      return 'promo';
    case 'market':
      return 'traction';
    case 'leadership':
      return 'lead';
    case 'interview':
      return 'interview';
    case 'salary_ambition':
      return 'salary';
    case 'results':
      return 'proof';
    default:
      return 'promo';
  }
}

function uniqueCardIds(keys: [IssueKey, IssueKey, IssueKey]): CardId[] {
  const out: CardId[] = [];
  for (const k of keys) {
    const id = issueKeyToCardId(k);
    if (!out.includes(id)) out.push(id);
  }
  const fallback: CardId[] = ['promo', 'interview', 'salary', 'traction', 'lead', 'proof'];
  for (const f of fallback) {
    if (out.length >= 3) break;
    if (!out.includes(f)) out.push(f);
  }
  return out.slice(0, 3);
}

function idToIcon(id: CardId): RiskCardIcon {
  if (id === 'traction') return 'traction';
  if (id === 'proof') return 'linkedin';
  return id;
}

function buildRiskCards(a: Answers): [RiskStatusCard, RiskStatusCard, RiskStatusCard] {
  const keys = getTopThreeIssueKeys(a);
  let ids = [...uniqueCardIds(keys)];
  if (salaryWeight(a.salaryRange) >= 3 && !ids.includes('salary')) {
    ids = [ids[0], ids[1], 'salary'];
  }
  return ids.map((id, i) => {
    const lib = CARD_LIBRARY[id];
    return {
      id: `${id}-${i}`,
      label: lib.label,
      status: lib.status,
      tone: 'critical' as const,
      icon: idToIcon(id),
    };
  }) as [RiskStatusCard, RiskStatusCard, RiskStatusCard];
}

function headlineFor(score: number): string {
  if (score <= 7) {
    return 'VOCÊ QUER MAIS DO QUE SEU POSICIONAMENTO SUSTENTA HOJE';
  }
  if (score <= 13) {
    return 'HOJE, SUA CARREIRA AINDA NÃO TE DEFENDE';
  }
  return 'SEU PERFIL HOJE NÃO SUSTENTA O NÍVEL QUE VOCÊ QUER DISPUTAR';
}

const SUBHEAD =
  'Você pode até ter capacidade para mais. Mas o mercado ainda não está te lendo nesse nível.';

const ALERT_CLAIM = 'Sua ambição está acima da forma como sua carreira aparece hoje.';

const ALERT_BULLETS: [string, string, string] = [
  'Pouco resultado visível no que o mercado enxerga',
  'Pouca liderança clara no que seu perfil mostra',
  'Pouco movimento concreto em direção ao cargo que você quer',
];

const CONSEQUENCE_BULLETS: [string, string, string] = [
  'Você continua fora do foco de quem decide promoção',
  'Você chega mal posicionado nas entrevistas que realmente importam',
  'Outros ocupam o espaço que você gostaria de disputar',
];

const CORRECTIONS: [CorrectionCardView, CorrectionCardView, CorrectionCardView] = [
  {
    title: 'ATUALIZAR LINKEDIN',
    body: 'Deixar explícito o que você faz e o impacto que gera.',
  },
  {
    title: 'CARGO X PERFIL',
    body: 'Seu perfil não está alinhado com o cargo que você deseja.',
  },
  {
    title: 'PLANO DE AÇÃO',
    body: 'Você precisa de um plano prático para conquistar seu objetivo.',
  },
];

const GOOD_NEWS =
  'Isso é corrigível. O problema não é falta de capacidade: é falta de plano de ação, de saber quais são os próximos passos e de um caminho claro para sair desta situação.';

export function buildVerdictScreen(a: Answers): VerdictScreenModel {
  const score = computeGapScore(a);

  return {
    headline: headlineFor(score),
    subhead: SUBHEAD,
    riskCards: buildRiskCards(a),
    alertClaim: ALERT_CLAIM,
    alertBullets: ALERT_BULLETS,
    consequenceBullets: CONSEQUENCE_BULLETS,
    correctionCards: CORRECTIONS,
    goodNewsBody: GOOD_NEWS,
  };
}
