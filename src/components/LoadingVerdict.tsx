import { useEffect, useState } from 'react';

const MESSAGES = [
  'Analisando os sinais do seu posicionamento profissional…',
  'Comparando sua ambição com a força da sua trajetória atual…',
  'Montando seu veredito profissional…',
] as const;

const MIN_MS = 2600;

interface LoadingVerdictProps {
  onComplete: () => void;
}

export function LoadingVerdict({ onComplete }: LoadingVerdictProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
    }, 900);

    const completeTimer = window.setTimeout(() => {
      window.clearInterval(interval);
      onComplete();
    }, MIN_MS);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="mm-loading-overlay" role="status" aria-live="polite" aria-busy="true">
      <div className="mm-loading-inner">
        <div className="mm-loading-bar" />
        <p className="mm-loading-text">{MESSAGES[messageIndex]}</p>
        <span className="sr-only">Gerando diagnóstico, aguarde.</span>
      </div>
    </div>
  );
}
