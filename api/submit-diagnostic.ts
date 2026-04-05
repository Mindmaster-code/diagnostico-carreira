import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const SUBJECT = 'Seu Veredito Profissional — MindMaster';

type Body = {
  email?: string;
  answers?: unknown;
  verdictPlain?: string;
  score?: number;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function escapeHtmlBody(plain: string): string {
  return plain
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body: Body;
  try {
    body = typeof req.body === 'string' ? (JSON.parse(req.body) as Body) : (req.body as Body);
  } catch {
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }

  const email = body.email?.trim().toLowerCase();
  const verdictPlain = body.verdictPlain?.trim();
  const score = typeof body.score === 'number' && Number.isFinite(body.score) ? Math.round(body.score) : null;

  if (!isNonEmptyString(email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: 'Invalid email' });
    return;
  }
  if (!isNonEmptyString(verdictPlain) || verdictPlain.length > 120_000) {
    res.status(400).json({ error: 'Invalid verdict text' });
    return;
  }
  if (body.answers === undefined || body.answers === null || typeof body.answers !== 'object') {
    res.status(400).json({ error: 'Invalid answers' });
    return;
  }

  const masterflowUrl =
    process.env.MASTERFLOW_URL?.trim() || 'https://masterflow-flame.vercel.app/';
  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#0a0f12;">
<pre style="white-space:pre-wrap;font-size:14px;">${escapeHtmlBody(verdictPlain)}</pre>
<p style="margin-top:1.5rem;"><a href="${masterflowUrl.replace(/"/g, '&quot;')}" style="color:#0a8d90;font-weight:700;">Abrir MasterFlow</a></p>
</body></html>`;

  let saved = false;
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (databaseUrl) {
    try {
      const sql = neon(databaseUrl);
      const answersJson = JSON.stringify(body.answers);
      await sql`
        INSERT INTO diagnostics (email, answers_json, verdict_plain, score)
        VALUES (${email}, ${answersJson}, ${verdictPlain}, ${score})
      `;
      saved = true;
    } catch (e) {
      console.error('diagnostics insert failed', e);
    }
  }

  let emailed = false;
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim() || 'MindMaster <onboarding@resend.dev>';

  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      const { error } = await resend.emails.send({
        from,
        to: email,
        subject: SUBJECT,
        text: `${verdictPlain}\n\nMasterFlow: ${masterflowUrl}`,
        html,
      });
      if (error) {
        console.error('resend error', error);
      } else {
        emailed = true;
      }
    } catch (e) {
      console.error('resend send failed', e);
    }
  }

  res.status(200).json({ ok: true, saved, emailed });
}
