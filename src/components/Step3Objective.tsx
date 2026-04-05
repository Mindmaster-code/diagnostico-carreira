import { useState, type ReactNode } from 'react';
import type {
  Answers,
  InterviewReadiness,
  LeadershipSignal,
  MarketInbound,
  ResultsVsFunctions,
} from '../types/answers';
import { QuestionStepMeta } from './QuestionStepMeta';

const Q1: { value: ResultsVsFunctions; label: string }[] = [
  { value: 'results_clear', label: 'Mostra resultados com clareza' },
  { value: 'results_some', label: 'Mostra só descrição do cargo que ocupei' },
  { value: 'more_functions', label: 'Mostra mais funções do que impacto' },
  { value: 'never_organized', label: 'Nunca organizei isso direito' },
];

const Q2: { value: MarketInbound; label: string }[] = [
  { value: 'often', label: 'Sim, com frequência' },
  { value: 'sometimes', label: 'Às vezes' },
  { value: 'rarely', label: 'Raramente' },
  { value: 'no', label: 'Não' },
];

const Q3: { value: LeadershipSignal; label: string }[] = [
  { value: 'leadership_clear', label: 'Mostra que estou pronto para liderar' },
  { value: 'mixed', label: 'Mostra algum potencial, mas ainda não sustenta' },
  { value: 'more_execution', label: 'Me deixa com cara de executor' },
  { value: 'no_leadership', label: 'Não transmite liderança' },
];

const Q4: { value: InterviewReadiness; label: string }[] = [
  { value: 'yes', label: 'Sim. Estou 100% preparado.' },
  { value: 'partial', label: 'Eu até me defenderia, mas ficariam brechas sérias.' },
  { value: 'fragile', label: 'Sinceramente, eu ainda não estou pronto.' },
  { value: 'no', label: 'Acho que passaria vergonha nessa entrevista.' },
];

const STEPS: {
  legend: ReactNode;
  aria: string;
  name: string;
  options: { value: string; label: string }[];
  get: (a: Answers) => unknown;
  key: keyof Answers;
}[] = [
  {
    legend: (
      <>
        Seu perfil do <span className="mm-linkedin">LinkedIn</span> mostra resultados concretos ou só descreve
        funções?
      </>
    ),
    aria: 'Perfil no LinkedIn: resultados concretos ou só funções',
    name: 'q1',
    options: Q1,
    get: (a) => a.resultsVsFunctions,
    key: 'resultsVsFunctions',
  },
  {
    legend: 'Você tem recebido convites para entrevistas compatíveis com o nível que deseja?',
    aria: 'Convites para entrevistas no nível desejado',
    name: 'q2',
    options: Q2,
    get: (a) => a.marketInbound,
    key: 'marketInbound',
  },
  {
    legend: (
      <>
        Hoje, seu perfil no <span className="mm-linkedin">LinkedIn</span> faz você parecer pronto para liderar ou só
        bom para executar?
      </>
    ),
    aria: 'Perfil no LinkedIn: liderança versus execução',
    name: 'q3',
    options: Q3,
    get: (a) => a.leadershipSignal,
    key: 'leadershipSignal',
  },
  {
    legend: 'Se a entrevista para o cargo que você quer fosse amanhã, você se sentiria pronto de verdade?',
    aria: 'Prontidão percebida para entrevista',
    name: 'q4',
    options: Q4,
    get: (a) => a.interviewReadiness,
    key: 'interviewReadiness',
  },
];

const TOTAL = STEPS.length;

interface Step3ObjectiveProps {
  answers: Answers;
  onChange: (patch: Partial<Answers>) => void;
  onSubmit: () => void;
}

export function Step3Objective({ answers, onChange, onSubmit }: Step3ObjectiveProps) {
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const selected = step.get(answers);

  const goNext = () => {
    if (selected === null) return;
    if (index < TOTAL - 1) setIndex((i) => i + 1);
    else onSubmit();
  };

  const goBack = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  return (
    <div className="mm-step-enter" key={index}>
      <QuestionStepMeta current={index + 1} total={TOTAL} />

      {index === 0 ? (
        <h1 className="mm-headline">Agora, alguns sinais objetivos do seu posicionamento atual.</h1>
      ) : (
        <p className="mm-step-eyebrow">Verificação objetiva</p>
      )}

      <fieldset className="mm-fieldset">
        <legend className="mm-legend">{step.legend}</legend>
        <div className="mm-options" role="radiogroup" aria-label={step.aria}>
          {step.options.map((opt) => (
            <div key={opt.value} className="mm-option">
              <input
                type="radio"
                name={step.name}
                id={`${step.name}-${opt.value}`}
                checked={selected === opt.value}
                onChange={() => onChange({ [step.key]: opt.value } as Partial<Answers>)}
              />
              <label className="mm-option-label" htmlFor={`${step.name}-${opt.value}`}>
                {opt.label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="mm-actions mm-actions--split">
        {index > 0 ? (
          <button type="button" className="mm-btn mm-btn-ghost mm-btn-ghost--bar" onClick={goBack}>
            Voltar
          </button>
        ) : (
          <span className="mm-actions__spacer" aria-hidden="true" />
        )}
        <button type="button" className="mm-btn mm-btn-primary" disabled={selected === null} onClick={goNext}>
          {index === TOTAL - 1 ? 'Continuar' : 'Avançar'}
        </button>
      </div>
    </div>
  );
}
