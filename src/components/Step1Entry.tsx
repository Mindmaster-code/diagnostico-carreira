import type { Answers } from '../types/answers';

interface Step1EntryProps {
  answers: Answers;
  onChange: (patch: Partial<Answers>) => void;
  onSubmit: () => void;
}

export function Step1Entry({ answers, onChange, onSubmit }: Step1EntryProps) {
  const valid =
    answers.currentRole.trim().length > 0 && answers.desiredRole.trim().length > 0;

  return (
    <div className="mm-step-enter">
      <h1 className="mm-headline">Vamos entender seu momento profissional atual em menos de 2 minutos.</h1>
      <p className="mm-subhead">
        Sem teste genérico. Sem perguntas desnecessárias. Só o suficiente para gerar um veredito claro sobre
        sua prontidão para o próximo nível.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) onSubmit();
        }}
      >
        <div className="mm-field">
          <label className="mm-label" htmlFor="current-role">
            Cargo ou função atual
          </label>
          <input
            id="current-role"
            className="mm-input"
            type="text"
            autoComplete="organization-title"
            value={answers.currentRole}
            onChange={(e) => onChange({ currentRole: e.target.value })}
            placeholder="Ex.: Analista de produto sênior"
            required
          />
        </div>
        <div className="mm-field">
          <label className="mm-label" htmlFor="desired-role">
            Próximo cargo desejado
          </label>
          <input
            id="desired-role"
            className="mm-input"
            type="text"
            value={answers.desiredRole}
            onChange={(e) => onChange({ desiredRole: e.target.value })}
            placeholder="Ex.: Gerente de produto"
            required
          />
        </div>
        <div className="mm-actions">
          <button type="submit" className="mm-btn mm-btn-primary" disabled={!valid}>
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
}
