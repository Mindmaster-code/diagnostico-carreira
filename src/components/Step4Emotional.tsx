import type { Answers, Fear90Days } from '../types/answers';

const OPTIONS: { value: Fear90Days; label: string }[] = [
  { value: 'invisible_promotion', label: 'Continuar sendo ignorado para promoção' },
  { value: 'below_salary', label: 'Ganhar menos do que eu deveria' },
  { value: 'lose_opportunities', label: 'Perder oportunidades por não parecer pronto' },
  { value: 'no_clarity', label: 'Continuar travado sem entender o porquê' },
  { value: 'unprepared_interviews', label: 'Passar aperto em entrevistas melhores' },
  { value: 'others_advance', label: 'Continuar no mesmo lugar enquanto outros avançam' },
];

interface Step4EmotionalProps {
  answers: Answers;
  onChange: (patch: Partial<Answers>) => void;
  onSubmit: () => void;
}

export function Step4Emotional({ answers, onChange, onSubmit }: Step4EmotionalProps) {
  const valid = answers.fear90Days !== null;

  return (
    <div className="mm-step-enter">
      <h1 className="mm-headline">Último ponto.</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) onSubmit();
        }}
      >
        <fieldset className="mm-fieldset">
          <legend className="mm-legend">
            Se nada mudar nos próximos 90 dias, o que mais te incomoda imaginar na sua carreira?
          </legend>
          <div className="mm-options" role="radiogroup" aria-label="Preocupação em 90 dias">
            {OPTIONS.map((opt) => (
              <div key={opt.value} className="mm-option">
                <input
                  type="radio"
                  name="fear"
                  id={`fear-${opt.value}`}
                  checked={answers.fear90Days === opt.value}
                  onChange={() => onChange({ fear90Days: opt.value })}
                />
                <label className="mm-option-label" htmlFor={`fear-${opt.value}`}>
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        <div className="mm-actions">
          <button type="submit" className="mm-btn mm-btn-primary mm-btn-primary--verdict" disabled={!valid}>
            Gerar Meu Veredito Profissional
          </button>
        </div>
      </form>
    </div>
  );
}
