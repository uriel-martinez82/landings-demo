# Autorización Danza — Escuela Agustina Spera

Landing con formulario de autorización que envía mails desde Gmail vía Nodemailer.

## Setup local

```bash
npm install
cp .env.example .env.local
# Completar variables en .env.local
npm run dev
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `RESEND_API_KEY` | API Key de tu cuenta Resend |

## Setup de Resend

1. Creá cuenta en [resend.com](https://resend.com) (gratis, 3.000 emails/mes)
2. Agregá tu dominio `mudigital.com.ar` en Resend → Domains → Add Domain
3. Resend te da registros DNS (TXT/MX/CNAME para SPF/DKIM) → agregalos en Cloudflare (igual que hicimos con el de Railway)
4. Una vez verificado el dominio, creá una API Key en Resend → API Keys
5. Pegá esa key en Railway → Variables → `RESEND_API_KEY`

El remitente queda configurado como `autorizaciones@mudigital.com.ar` (definido en el código, en `app/api/enviar/route.ts`).

## Deploy en Railway

1. Subí el proyecto a GitHub
2. railway.app → New Project → Deploy from GitHub
3. En Variables agregás GMAIL_USER y GMAIL_APP_PASSWORD
4. Railway buildea y deploya automáticamente

## Dominio (NIC.ar)

Una vez deployado en Railway:
1. En Railway → Settings → Domains → Add Custom Domain
2. Railway te da un valor CNAME
3. En NIC.ar → tu dominio → DNS → agregar registro CNAME con ese valor
