type Phase =
  | 'landing'
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'loading'
  | 'verdict'
  | 'solo';

function progressPercent(phase: Phase): number {
  switch (phase) {
    case 'landing':
      return 0;
    case 'step1':
      return 20;
    case 'step2':
      return 40;
    case 'step3':
      return 60;
    case 'step4':
      return 80;
    case 'loading':
      return 88;
    case 'verdict':
    case 'solo':
      return 100;
    default:
      return 0;
  }
}

interface ProgressBarProps {
  phase: Phase;
}

export function ProgressBar({ phase }: ProgressBarProps) {
  const pct = progressPercent(phase);

  return (
    <div className="mm-progress-wrap" aria-hidden={phase === 'solo'}>
      <div className="mm-progress-track">
        <div className="mm-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="mm-progress-caption">
        Diagnóstico de <span className="mm-progress-caption__accent">Carreira</span>
      </p>
    </div>
  );
}
