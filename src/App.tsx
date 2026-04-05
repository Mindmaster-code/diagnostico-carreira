import { useCallback, useEffect, useMemo, useState } from 'react';
import { computeGapScore } from './lib/verdict';
import { serializeVerdictEmail } from './lib/serializeVerdictEmail';
import { submitDiagnostic } from './lib/submitDiagnostic';
import { buildVerdictScreen } from './lib/verdictScreen';
import { LoadingVerdict } from './components/LoadingVerdict';
import { ProgressBar } from './components/ProgressBar';
import { SoloPlanScreen } from './components/SoloPlanScreen';
import { LandingPage } from './components/LandingPage';
import { Step1Entry } from './components/Step1Entry';
import { Step2Ambition } from './components/Step2Ambition';
import { Step3Objective } from './components/Step3Objective';
import { Step4Emotional } from './components/Step4Emotional';
import { Step5Verdict } from './components/Step5Verdict';
import { initialAnswers, type Answers } from './types/answers';

type Phase = 'landing' | 'step1' | 'step2' | 'step3' | 'step4' | 'loading' | 'verdict' | 'solo';

function App() {
  const [phase, setPhase] = useState<Phase>('landing');
  const [answers, setAnswers] = useState<Answers>(initialAnswers);

  const patchAnswers = useCallback((patch: Partial<Answers>) => {
    setAnswers((prev) => ({ ...prev, ...patch }));
  }, []);

  const verdictScreen = useMemo(() => buildVerdictScreen(answers), [answers]);

  const handleLoadingDone = useCallback(() => {
    setPhase('verdict');
  }, []);

  useEffect(() => {
    if (phase !== 'verdict') return;
    const email = answers.email.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    const storageKey = `mm-verdict-mail:${email}`;
    if (typeof sessionStorage === 'undefined') return;
    if (sessionStorage.getItem(storageKey) === 'ok') return;
    if (sessionStorage.getItem(storageKey) === 'sending') return;
    sessionStorage.setItem(storageKey, 'sending');

    const verdictPlain = serializeVerdictEmail(verdictScreen);
    const score = computeGapScore(answers);

    let finished = false;
    void submitDiagnostic({ email, answers, verdictPlain, score })
      .then(() => {
        finished = true;
        sessionStorage.setItem(storageKey, 'ok');
      })
      .catch((err) => {
        sessionStorage.removeItem(storageKey);
        console.warn('Envio do veredito (e-mail / servidor) falhou:', err);
      });

    return () => {
      if (!finished && sessionStorage.getItem(storageKey) === 'sending') {
        sessionStorage.removeItem(storageKey);
      }
    };
  }, [phase, answers, verdictScreen]);

  return (
    <div className="mm-app">
      <header className="mm-header">
        <div className="mm-brand">
          <span className="mm-brand-name">MindMaster</span>
          <span className="mm-product">Veredito Profissional</span>
        </div>
      </header>

      {phase !== 'solo' && phase !== 'landing' && <ProgressBar phase={phase} />}

      <main className="mm-main">
        {phase === 'landing' && (
          <LandingPage answers={answers} onChange={patchAnswers} onStart={() => setPhase('step1')} />
        )}
        {phase === 'step1' && (
          <Step1Entry
            answers={answers}
            onChange={patchAnswers}
            onSubmit={() => setPhase('step2')}
          />
        )}
        {phase === 'step2' && (
          <Step2Ambition
            answers={answers}
            onChange={patchAnswers}
            onSubmit={() => setPhase('step3')}
          />
        )}
        {phase === 'step3' && (
          <Step3Objective
            answers={answers}
            onChange={patchAnswers}
            onSubmit={() => setPhase('step4')}
          />
        )}
        {phase === 'step4' && (
          <Step4Emotional
            answers={answers}
            onChange={patchAnswers}
            onSubmit={() => setPhase('loading')}
          />
        )}
        {phase === 'verdict' && <Step5Verdict screen={verdictScreen} onSolo={() => setPhase('solo')} />}
        {phase === 'solo' && <SoloPlanScreen onBack={() => setPhase('verdict')} />}
      </main>

      {phase === 'loading' && <LoadingVerdict onComplete={handleLoadingDone} />}
    </div>
  );
}

export default App;
