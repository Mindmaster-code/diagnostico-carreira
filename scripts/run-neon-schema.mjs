/**
 * Cria a tabela diagnostics no Neon.
 * Uso: DATABASE_URL="postgresql://..." node scripts/run-neon-schema.mjs
 * ou:  node --env-file=.env.local scripts/run-neon-schema.mjs
 */
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error(
    'Defina DATABASE_URL (string de conexão do Neon, igual à da Vercel).\n' +
      'Ex.: DATABASE_URL="postgresql://..." node scripts/run-neon-schema.mjs',
  );
  process.exit(1);
}

const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS diagnostics (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    email TEXT NOT NULL,
    answers_json JSONB NOT NULL,
    verdict_plain TEXT NOT NULL,
    score INTEGER
  )
`;

await sql`
  CREATE INDEX IF NOT EXISTS diagnostics_email_idx ON diagnostics (email)
`;

await sql`
  CREATE INDEX IF NOT EXISTS diagnostics_created_at_idx ON diagnostics (created_at DESC)
`;

console.log('OK: tabela diagnostics e índices criados (ou já existiam).');
