import type { Answers } from '../types/answers';

export interface SubmitDiagnosticPayload {
  email: string;
  answers: Answers;
  verdictPlain: string;
  score: number;
}

export async function submitDiagnostic(payload: SubmitDiagnosticPayload): Promise<void> {
  const res = await fetch('/api/submit-diagnostic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
}
