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
| `GMAIL_USER` | Tu cuenta Gmail (ej: danzayartelugano@gmail.com) |
| `GMAIL_APP_PASSWORD` | App Password de Google (ver abajo) |

## Cómo obtener el App Password de Gmail

1. Entrá a myaccount.google.com
2. Seguridad → Verificación en 2 pasos (activar si no está)
3. Seguridad → Contraseñas de aplicaciones
4. Generá una nueva → copiá las 16 letras → pegala en GMAIL_APP_PASSWORD

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
