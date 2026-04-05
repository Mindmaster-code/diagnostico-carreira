import type {
  Answers,
  CurrentSituation,
  Fear90Days,
  InterviewReadiness,
  LeadershipSignal,
  MarketInbound,
  ResultsVsFunctions,
  SalaryRange,
} from '../types/answers';

export interface VerdictOutput {
  opening: string;
  pressurePoints: [string, string, string];
  riskParagraph: string;
  diagnosticLines: [string, string, string];
  corrections: [string, string, string];
  goodNews: string;
}

export type IssueKey =
  | 'market'
  | 'results'
  | 'leadership'
  | 'interview'
  | 'visibility'
  | 'salary_ambition'
  | 'positioning';

const ISSUE_COPY: Record<IssueKey, string> = {
  market:
    'O mercado não está te puxando com frequência para oportunidades no patamar que você deseja. Isso é um sinal objetivo de leitura, não impressão.',
  results:
    'Seu posicionamento ainda comunica mais função e rotina do que resultado mensurável. Quem decide promoção e contratação compra impacto legível.',
  leadership:
    'Na forma como sua carreira aparece hoje, a leitura pende para execução. O próximo nível costuma exigir sinais claros de direção e decisão.',
  interview:
    'Para o cargo que você mira, seu histórico ainda deixaria pontos sensíveis abertos em uma conversa técnica de seleção.',
  visibility:
    'Esforço visível não substitui sinalização visível. Se você não é lembrado para subir, o problema tende a ser leitura, não dedicação.',
  salary_ambition:
    'A faixa salarial que você deseja exige uma leitura de prontidão e senioridade que seu perfil ainda não ancora com consistência.',
  positioning:
    'Há um vão entre o nível em que você se enxerga e o nível em que sua trajetória está sendo interpretada hoje.',
};

export function salaryWeight(s: SalaryRange | null): number {
  if (!s) return 0;
  const map: Record<SalaryRange, number> = {
    up5k: 0,
    '5to8': 1,
    '8to12': 2,
    '12to20': 3,
    '20plus': 4,
  };
  return map[s];
}

function situationWeight(s: CurrentSituation | null): { score: number; keys: IssueKey[] } {
  if (!s) return { score: 0, keys: [] };
  const table: Record<CurrentSituation, { score: number; keys: IssueKey[] }> = {
    grow_unknown: { score: 1, keys: ['positioning'] },
    not_remembered: { score: 2, keys: ['visibility'] },
    experience_not_shown: { score: 2, keys: ['results', 'positioning'] },
    positioning_below: { score: 2, keys: ['positioning'] },
    stagnant: { score: 2, keys: ['positioning'] },
  };
  return table[s];
}

function resultsWeight(r: ResultsVsFunctions | null): { score: number; keys: IssueKey[] } {
  if (!r) return { score: 0, keys: [] };
  const table: Record<ResultsVsFunctions, { score: number; keys: IssueKey[] }> = {
    results_clear: { score: 0, keys: [] },
    results_some: { score: 1, keys: ['results'] },
    more_functions: { score: 2, keys: ['results'] },
    never_organized: { score: 3, keys: ['results'] },
  };
  return table[r];
}

function marketWeight(m: MarketInbound | null): { score: number; keys: IssueKey[] } {
  if (!m) return { score: 0, keys: [] };
  const table: Record<MarketInbound, { score: number; keys: IssueKey[] }> = {
    often: { score: 0, keys: [] },
    sometimes: { score: 1, keys: ['market'] },
    rarely: { score: 2, keys: ['market'] },
    no: { score: 3, keys: ['market'] },
  };
  return table[m];
}

function leadershipWeight(l: LeadershipSignal | null): { score: number; keys: IssueKey[] } {
  if (!l) return { score: 0, keys: [] };
  const table: Record<LeadershipSignal, { score: number; keys: IssueKey[] }> = {
    leadership_clear: { score: 0, keys: [] },
    mixed: { score: 1, keys: ['leadership'] },
    more_execution: { score: 2, keys: ['leadership'] },
    no_leadership: { score: 3, keys: ['leadership'] },
  };
  return table[l];
}

function interviewWeight(i: InterviewReadiness | null): { score: number; keys: IssueKey[] } {
  if (!i) return { score: 0, keys: [] };
  const table: Record<InterviewReadiness, { score: number; keys: IssueKey[] }> = {
    yes: { score: 0, keys: [] },
    partial: { score: 1, keys: ['interview'] },
    fragile: { score: 2, keys: ['interview'] },
    no: { score: 3, keys: ['interview'] },
  };
  return table[i];
}

function roleGapBonus(a: Answers): number {
  const c = a.currentRole.trim().toLowerCase();
  const d = a.desiredRole.trim().toLowerCase();
  if (!c || !d) return 0;
  if (c === d) return 0;
  return 1;
}

export function computeGapScore(a: Answers): number {
  const sit = situationWeight(a.currentSituation);
  const res = resultsWeight(a.resultsVsFunctions);
  const mkt = marketWeight(a.marketInbound);
  const lead = leadershipWeight(a.leadershipSignal);
  const intv = interviewWeight(a.interviewReadiness);
  return (
    salaryWeight(a.salaryRange) +
    sit.score +
    res.score +
    mkt.score +
    lead.score +
    intv.score +
    roleGapBonus(a)
  );
}

function collectIssueKeys(a: Answers): Map<IssueKey, number> {
  const weights = new Map<IssueKey, number>();
  const add = (keys: IssueKey[], w: number) => {
    if (w <= 0 || keys.length === 0) return;
    for (const k of keys) {
      weights.set(k, (weights.get(k) ?? 0) + w);
    }
  };
  const sw = situationWeight(a.currentSituation);
  add(sw.keys, sw.score);
  const rw = resultsWeight(a.resultsVsFunctions);
  add(rw.keys, rw.score);
  const mw = marketWeight(a.marketInbound);
  add(mw.keys, mw.score);
  const lw = leadershipWeight(a.leadershipSignal);
  add(lw.keys, lw.score);
  const iw = interviewWeight(a.interviewReadiness);
  add(iw.keys, iw.score);
  const sal = salaryWeight(a.salaryRange);
  if (sal >= 3) {
    add(['salary_ambition'], sal);
  }
  return weights;
}

export function getTopThreeIssueKeys(a: Answers): [IssueKey, IssueKey, IssueKey] {
  const map = collectIssueKeys(a);
  const ranked = [...map.entries()].sort((x, y) => y[1] - x[1]);
  const keys: IssueKey[] = [];
  for (const [k] of ranked) {
    if (!keys.includes(k)) keys.push(k);
  }
  const defaults: IssueKey[] = ['positioning', 'results', 'market'];
  for (const d of defaults) {
    if (keys.length >= 3) break;
    if (!keys.includes(d)) keys.push(d);
  }
  const three = keys.slice(0, 3);
  return [three[0], three[1], three[2]];
}

function topPressurePoints(a: Answers): [string, string, string] {
  const three = getTopThreeIssueKeys(a);
  return [ISSUE_COPY[three[0]], ISSUE_COPY[three[1]], ISSUE_COPY[three[2]]];
}

function fearRiskText(f: Fear90Days | null): string {
  const base =
    'Ignorar o desalinhamento entre o que você quer e o que sua carreira comunica costuma endurecer o problema: não desaparece, só fica mais caro corrigir depois.';
  const tail: Record<Fear90Days, string> = {
    invisible_promotion:
      ' Nos próximos 90 dias, o cenário que você descreve — permanecer fora do radar para promoção — tende a se repetir se a sinalização não mudar.',
    below_salary:
      ' Nos próximos 90 dias, a distância entre a sua meta salarial e a leitura do mercado sobre você tende a se manter, ou piorar, se o posicionamento não for corrigido.',
    lose_opportunities:
      ' Nos próximos 90 dias, oportunidades melhores tendem a passar para perfis que já aparecem prontos no nível certo — não para quem ainda precisa “explicar demais”.',
    no_clarity:
      ' Nos próximos 90 dias, sem clareza do que falta, você arrisca investir esforço na ordem errada e manter o mesmo padrão de resultado invisível.',
    unprepared_interviews:
      ' Nos próximos 90 dias, chegar exposto em entrevistas continua sendo um risco real se o histórico não for reorganizado em narrativa sustentável.',
    others_advance:
      ' Nos próximos 90 dias, ver outros avançar enquanto você mantém o mesmo padrão de apresentação profissional costuma virar evidência dolorosa, não surpresa.',
  };
  if (!f) return base;
  return base + tail[f];
}

function openingForScore(score: number, a: Answers): string {
  const highSalary = salaryWeight(a.salaryRange) >= 3;
  if (score <= 7) {
    return highSalary
      ? 'Hoje, sua carreira carrega tração, mas ainda não fecha com firmeza o salto para a faixa e o patamar que você deseja.'
      : 'Hoje, há traço de desalinhamento entre o próximo nível que você quer e a forma como sua trajetória está sendo lida no mercado.';
  }
  if (score <= 13) {
    return 'Existe um desalinhamento claro entre o cargo que você deseja e a forma como sua trajetória está sendo percebida hoje.';
  }
  return 'Hoje, sua carreira não está sustentando com força o próximo nível que você quer alcançar. O problema não é esforço em silêncio: é força na leitura do que você entrega.';
}

function diagnosticFor(a: Answers, score: number): [string, string, string] {
  const lines: [string, string, string] = [
    'Sua ambição está acima da sua sinalização profissional atual.',
    'Hoje, você pode até ter bagagem para mais, mas sua carreira ainda não comunica isso com força suficiente.',
    'O mercado não promove potencial escondido. Promove quem parece pronto para o próximo patamar.',
  ];
  if (score <= 7) {
    lines[0] =
      'O descompasso existe, mas ainda é trabalhável com ajuste focado de posicionamento e prova de valor.';
  }
  if (marketWeight(a.marketInbound).score >= 2) {
    lines[1] =
      'A baixa procura por oportunidades no nível desejado indica leitura conservadora do seu perfil — não “falta de sorte”.';
  }
  if (interviewWeight(a.interviewReadiness).score >= 2) {
    lines[2] =
      'Em processo seletivo, exposição importa: fragilidade na sustentação do histórico vira risco objetivo, não detalhe.';
  }
  return lines;
}

function correctionsFor(a: Answers): [string, string, string] {
  const c1 =
    a.resultsVsFunctions === 'results_clear' || a.resultsVsFunctions === 'results_some'
      ? 'Organizar e elevar a densidade de prova: números, escopo, decisão — sem diluir em lista de tarefas.'
      : 'Transformar experiência em prova concreta de valor: resultado legível, não descrição de função.';

  const c2 =
    a.leadershipSignal === 'leadership_clear'
      ? 'Manter liderança explícita na narrativa e amarrar decisões a outcomes — evitar parecer só “quem executa”.'
      : 'Reforçar sinais de liderança e decisão: direção, trade-offs, responsabilidade além da entrega tática.';

  const c3 =
    salaryWeight(a.salaryRange) >= 3
      ? 'Alinhar linguagem, histórico e presença ao patamar salarial e de senioridade que você quer disputar.'
      : 'Alinhar sua apresentação profissional ao nível que você quer disputar — cargo, senioridade e narrativa coerentes.';

  return [c1, c2, c3];
}

export function buildVerdict(a: Answers): VerdictOutput {
  const score = computeGapScore(a);
  return {
    opening: openingForScore(score, a),
    pressurePoints: topPressurePoints(a),
    riskParagraph: fearRiskText(a.fear90Days),
    diagnosticLines: diagnosticFor(a, score),
    corrections: correctionsFor(a),
    goodNews:
      'Isso é corrigível. Este veredito não aponta falta de capacidade. Aponta falta de plano de ação, de clareza sobre os próximos passos e de saber como sair desta situação com método.',
  };
}
