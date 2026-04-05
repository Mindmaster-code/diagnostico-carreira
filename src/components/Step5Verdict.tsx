import type { RiskCardIcon, RiskStatusCard, VerdictScreenModel } from '../lib/verdictScreen';
import { MASTERFLOW_URL } from '../config';

interface Step5VerdictProps {
  screen: VerdictScreenModel;
  onSolo: () => void;
}

function IconPromo({ className }: { className?: string }) {
  return (
    <svg className={className} width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTraction({ className }: { className?: string }) {
  return (
    <svg className={className} width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M7 14l4-4 4 4 5-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLead({ className }: { className?: string }) {
  return (
    <svg className={className} width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconInterview({ className }: { className?: string }) {
  return (
    <svg className={className} width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 10h8M8 14h5M6 4h12a2 2 0 012 2v12l-4-3H6a2 2 0 01-2-2V6a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSalary({ className }: { className?: string }) {
  return (
    <svg className={className} width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg className={className} width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M8 10v7M8 8h.01M12 17v-4.2c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8V17"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconAlertBig({ className }: { className?: string }) {
  return (
    <svg className={className} width={32} height={32} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 9v4m0 4h.01M4.2 19h15.6a1 1 0 00.9-1.45L12.9 4.55a1 1 0 00-1.8 0L3.3 17.55A1 1 0 004.2 19z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RiskCardIconEl({ icon }: { icon: RiskCardIcon }) {
  const c = 'mm-vp2-risk__icon';
  switch (icon) {
    case 'lead':
      return <IconLead className={c} />;
    case 'interview':
      return <IconInterview className={c} />;
    case 'salary':
      return <IconSalary className={c} />;
    case 'linkedin':
      return <IconLinkedIn className={c} />;
    case 'traction':
      return <IconTraction className={c} />;
    case 'promo':
    case 'proof':
    default:
      return <IconPromo className={c} />;
  }
}

function RiskCard({ card }: { card: RiskStatusCard }) {
  return (
    <article className="mm-vp2-risk" aria-label={`${card.label}: ${card.status}`}>
      <RiskCardIconEl icon={card.icon} />
      <p className="mm-vp2-risk__label">{card.label}</p>
      <p className="mm-vp2-risk__status">{card.status}</p>
    </article>
  );
}

export function Step5Verdict({ screen, onSolo }: Step5VerdictProps) {
  return (
    <div className="mm-step-enter mm-vp2">
      <header className="mm-vp2-hero">
        <p className="mm-vp2-hero__brand">MindMaster</p>
        <h1 className="mm-vp2-hero__headline">{screen.headline}</h1>
        <p className="mm-vp2-hero__sub">{screen.subhead}</p>
      </header>

      <section className="mm-vp2-strip" aria-label="Alertas">
        <div className="mm-vp2-risk-row">
          {screen.riskCards.map((c) => (
            <RiskCard key={c.id} card={c} />
          ))}
        </div>
      </section>

      <section className="mm-vp2-alert-block" role="alert" aria-labelledby="vp2-alert-h">
        <div className="mm-vp2-alert-block__top">
          <IconAlertBig className="mm-vp2-alert-block__icon" aria-hidden="true" />
          <h2 id="vp2-alert-h" className="mm-vp2-alert-block__title">
            ALERTA
          </h2>
        </div>
        <p className="mm-vp2-alert-block__claim">{screen.alertClaim}</p>
        <ul className="mm-vp2-alert-block__list">
          {screen.alertBullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </section>

      <section className="mm-vp2-conseq" aria-labelledby="vp2-conseq">
        <h2 id="vp2-conseq" className="mm-vp2-conseq__title">
          SE NADA MUDAR
        </h2>
        <ul className="mm-vp2-conseq__list">
          {screen.consequenceBullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </section>

      <section className="mm-vp2-fix" aria-labelledby="vp2-fix">
        <h2 id="vp2-fix" className="mm-vp2-fix__title">
          VOCÊ PRECISA CORRIGIR URGENTE
        </h2>
        <div className="mm-vp2-fix-row">
          {screen.correctionCards.map((c) => (
            <article key={c.title} className="mm-vp2-fix-card">
              <h3 className="mm-vp2-fix-card__title">{c.title}</h3>
              <p className="mm-vp2-fix-card__body">{c.body}</p>
            </article>
          ))}
        </div>
      </section>

      <aside className="mm-vp2-escape" role="note">
        <h2 className="mm-vp2-escape__title">A BOA NOTÍCIA</h2>
        <p className="mm-vp2-escape__body">{screen.goodNewsBody}</p>
      </aside>

      <footer className="mm-vp2-choice">
        <h2 className="mm-vp2-choice__title">AGORA VOCÊ TEM DOIS CAMINHOS</h2>
        <div className="mm-vp2-choice-grid">
          <button type="button" className="mm-vp2-card mm-vp2-card--solo" onClick={onSolo}>
            <h3 className="mm-vp2-card__head">QUERO SEGUIR SOZINHO</h3>
            <p className="mm-vp2-card__txt">
              Ver a estrutura do que precisa ser corrigido e tentar ajustar por conta própria.
            </p>
            <span className="mm-vp2-card__btn mm-vp2-card__btn--ghost">VER MEU PLANO</span>
          </button>
          <a className="mm-vp2-card mm-vp2-card--help" href={MASTERFLOW_URL}>
            <h3 className="mm-vp2-card__head">EU QUERO AJUDA</h3>
            <p className="mm-vp2-card__txt">Corrigir isso com método, direção e apoio dentro do MasterFlow.</p>
            <span className="mm-vp2-card__btn mm-vp2-card__btn--solid">EU QUERO AJUDA</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
