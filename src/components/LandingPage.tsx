import type { Answers } from '../types/answers';

interface LandingPageProps {
  answers: Answers;
  onChange: (patch: Partial<Answers>) => void;
  onStart: () => void;
}

function isValidEmail(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function LandingPage({ answers, onChange, onStart }: LandingPageProps) {
  const valid = isValidEmail(answers.email);

  return (
    <div className="mm-step-enter mm-landing">
      <p className="mm-landing__eyebrow">Veredito Profissional</p>
      <h1 className="mm-landing__title">Descubra em minutos o que o mercado enxerga na sua carreira hoje</h1>
      <p className="mm-landing__lead">
        Um diagnóstico direto, sem enrolação. Informe seu e-mail para começar e receber o resultado alinhado ao seu contato.
      </p>

      <form
        className="mm-landing__form"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) onStart();
        }}
      >
        <div className="mm-field">
          <label className="mm-label" htmlFor="landing-email">
            E-mail
          </label>
          <input
            id="landing-email"
            name="email"
            className="mm-input"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="seu@email.com"
            value={answers.email}
            onChange={(e) => onChange({ email: e.target.value })}
            required
            aria-invalid={answers.email.length > 0 && !valid}
          />
        </div>
        <div className="mm-actions mm-landing__actions">
          <button type="submit" className="mm-btn mm-btn-primary mm-landing__cta" disabled={!valid}>
            Iniciar
          </button>
        </div>
      </form>
    </div>
  );
}
