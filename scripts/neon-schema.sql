-- Execute no SQL Editor do Neon (Storage na Vercel ou console.neon.tech)
CREATE TABLE IF NOT EXISTS diagnostics (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email TEXT NOT NULL,
  answers_json JSONB NOT NULL,
  verdict_plain TEXT NOT NULL,
  score INTEGER
);

CREATE INDEX IF NOT EXISTS diagnostics_email_idx ON diagnostics (email);
CREATE INDEX IF NOT EXISTS diagnostics_created_at_idx ON diagnostics (created_at DESC);
