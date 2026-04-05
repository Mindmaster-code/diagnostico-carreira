# Deploy na Vercel: e-mail + banco (Neon)

Sim: dá para ter banco na Vercel usando **Neon** (Postgres serverless) pelo painel da Vercel em **Storage → Create Database → Neon**. A connection string vira a variável `DATABASE_URL` no projeto.

## 1. Criar a tabela

**Opção A (recomendado, na sua máquina):** na raiz do projeto, crie `.env.local` com `DATABASE_URL=` (a mesma string da Vercel) e rode:

```bash
npm run db:schema
```

**Opção B:** no SQL Editor do Neon, rode o arquivo `scripts/neon-schema.sql`.

## 2. Variáveis de ambiente no projeto Vercel

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | Não* | Connection string do Neon. Sem isso, o app só não grava no banco. |
| `RESEND_API_KEY` | Não* | Chave da [Resend](https://resend.com). Sem isso, o e-mail não é enviado. |
| `RESEND_FROM` | Não | Remetente, ex.: `MindMaster <noreply@seudominio.com>`. No sandbox da Resend use `MindMaster <onboarding@resend.dev>` (só para e-mails de teste). |
| `MASTERFLOW_URL` | Não | Link no corpo do e-mail. Padrão: `https://masterflow-flame.vercel.app/` |

\* Em produção você vai querer os dois ligados para salvar respostas e enviar o veredito.

## 3. Função serverless

O endpoint `POST /api/submit-diagnostic` roda só na Vercel (ou com `vercel dev`). No `npm run dev` local, a chamada retorna 404 e o app continua normalmente (só aparece aviso no console).

## 4. Resend

Crie conta na Resend, verifique um domínio para enviar para qualquer destinatário, ou use `onboarding@resend.dev` apenas para o seu próprio e-mail em testes.
