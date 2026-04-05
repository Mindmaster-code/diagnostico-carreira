import { useState } from 'react';
import type { Answers, CurrentSituation, SalaryRange } from '../types/answers';
import { QuestionStepMeta } from './QuestionStepMeta';

const SALARY_OPTIONS: { value: SalaryRange; label: string }[] = [
  { value: 'up5k', label: 'Até R$ 5 mil' },
  { value: '5to8', label: 'R$ 5 mil a R$ 8 mil' },
  { value: '8to12', label: 'R$ 8 mil a R$ 12 mil' },
  { value: '12to20', label: 'R$ 12 mil a R$ 20 mil' },
  { value: '20plus', label: 'R$ 20 mil+' },
];

const SITUATION_OPTIONS: { value: CurrentSituation; label: string }[] = [
  { value: 'grow_unknown', label: 'Quero crescer, mas não sei exatamente o que está faltando' },
  { value: 'not_remembered', label: 'Trabalho muito, mas não sou lembrado para subir' },
  { value: 'experience_not_shown', label: 'Tenho experiência, mas meu perfil não transmite isso' },
  { value: 'positioning_below', label: 'Meu posicionamento parece abaixo do nível que eu quero' },
  { value: 'stagnant', label: 'Estou estagnado e sei que algo precisa mudar' },
];

const TOTAL = 2;

interface Step2AmbitionProps {
  answers: Answers;
  onChange: (patch: Partial<Answers>) => void;
  onSubmit: () => void;
}

export function Step2Ambition({ answers, onChange, onSubmit }: Step2AmbitionProps) {
  const [index, setIndex] = useState(0);

  const salaryOk = answers.salaryRange !== null;
  const situationOk = answers.currentSituation !== null;

  const goNext = () => {
    if (index === 0 && salaryOk) setIndex(1);
    else if (index === 1 && situationOk) onSubmit();
  };

  return (
    <div className="mm-step-enter" key={index}>
      <QuestionStepMeta current={index + 1} total={TOTAL} />

      {index === 0 ? (
        <>
          <h1 className="mm-headline">Agora vamos comparar seu momento atual com o nível que você quer alcançar.</h1>
          <fieldset className="mm-fieldset">
            <legend className="mm-legend">Faixa salarial desejada</legend>
            <div className="mm-options" role="radiogroup" aria-label="Faixa salarial desejada">
              {SALARY_OPTIONS.map((opt) => (
                <div key={opt.value} className="mm-option">
                  <input
                    type="radio"
                    name="salary"
                    id={`salary-${opt.value}`}
                    checked={answers.salaryRange === opt.value}
                    onChange={() => onChange({ salaryRange: opt.value })}
                  />
                  <label className="mm-option-label" htmlFor={`salary-${opt.value}`}>
                    {opt.label}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </>
      ) : (
        <>
          <p className="mm-step-eyebrow">Ambição e contexto</p>
          <h1 className="mm-headline mm-headline--compact">Como você descreve sua situação hoje?</h1>
          <fieldset className="mm-fieldset">
            <legend className="sr-only">Situação atual</legend>
            <div className="mm-options" role="radiogroup" aria-label="Situação atual">
              {SITUATION_OPTIONS.map((opt) => (
                <div key={opt.value} className="mm-option">
                  <input
                    type="radio"
                    name="situation"
                    id={`situation-${opt.value}`}
                    checked={answers.currentSituation === opt.value}
                    onChange={() => onChange({ currentSituation: opt.value })}
                  />
                  <label className="mm-option-label" htmlFor={`situation-${opt.value}`}>
                    {opt.label}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </>
      )}

      <div className="mm-actions mm-actions--split">
        {index > 0 ? (
          <button type="button" className="mm-btn mm-btn-ghost mm-btn-ghost--bar" onClick={() => setIndex(0)}>
            Voltar
          </button>
        ) : (
          <span className="mm-actions__spacer" aria-hidden="true" />
        )}
        <button
          type="button"
          className="mm-btn mm-btn-primary"
          disabled={index === 0 ? !salaryOk : !situationOk}
          onClick={goNext}
        >
          {index === 0 ? 'Avançar' : 'Avançar'}
        </button>
      </div>
    </div>
  );
}
