import { MASTERFLOW_URL } from '../config';
import type { VerdictScreenModel } from './verdictScreen';

/** Texto plano do veredito para e-mail e gravação no banco. */
export function serializeVerdictEmail(screen: VerdictScreenModel): string {
  const lines: string[] = [];

  lines.push('MINDMASTER');
  lines.push('VEREDITO PROFISSIONAL');
  lines.push('');
  lines.push(screen.headline);
  lines.push('');
  lines.push(screen.subhead);
  lines.push('');
  lines.push('STATUS');
  for (const c of screen.riskCards) {
    lines.push(`• ${c.label}: ${c.status}`);
  }
  lines.push('');
  lines.push('ALERTA');
  lines.push(screen.alertClaim);
  for (const b of screen.alertBullets) {
    lines.push(`• ${b}`);
  }
  lines.push('');
  lines.push('SE NADA MUDAR');
  for (const b of screen.consequenceBullets) {
    lines.push(`• ${b}`);
  }
  lines.push('');
  lines.push('VOCÊ PRECISA CORRIGIR URGENTE');
  for (const c of screen.correctionCards) {
    lines.push(`• ${c.title}: ${c.body}`);
  }
  lines.push('');
  lines.push('A BOA NOTÍCIA');
  lines.push(screen.goodNewsBody);
  lines.push('');
  lines.push('MASTERFLOW (MENTORIA E MÉTODO)');
  lines.push(MASTERFLOW_URL);

  return lines.join('\n');
}
