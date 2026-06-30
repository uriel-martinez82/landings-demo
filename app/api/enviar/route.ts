import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

function buildEmailHTML(alumno: string, responsable: string, dni: string) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Georgia, serif; background: #FAF7F2; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #fff; border: 1px solid #E8DCC8; }
    .header { background: #1A1410; padding: 32px 40px; text-align: center; }
    .header h1 { color: #C9A84C; font-size: 20px; margin: 0; letter-spacing: 2px; text-transform: uppercase; }
    .header p { color: #F0DFA0; font-size: 13px; margin: 8px 0 0; font-family: 'Inter', sans-serif; }
    .divider { height: 3px; background: linear-gradient(to right, #C9A84C, #F0DFA0, #C9A84C); }
    .body { padding: 40px; }
    .nota { background: #FAF7F2; border-left: 3px solid #C9A84C; padding: 24px 28px; font-size: 16px; line-height: 1.8; color: #1A1410; margin-bottom: 32px; }
    .nota strong { color: #8B6914; }
    .campos { margin-top: 24px; }
    .campo { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #E8DCC8; font-size: 14px; }
    .campo-label { color: #6B5E4E; font-family: sans-serif; }
    .campo-valor { font-weight: 600; color: #1A1410; }
    .footer { background: #1A1410; padding: 20px 40px; text-align: center; }
    .footer p { color: #6B5E4E; font-size: 12px; margin: 0; font-family: sans-serif; }
    .footer span { color: #C9A84C; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Escuela de Danza y Arte</h1>
      <p>Agustina Spera</p>
    </div>
    <div class="divider"></div>
    <div class="body">
      <div class="nota">
        Autorizo a mi hija <strong>${alumno}</strong> a concurrir el <strong>5 de julio</strong> al <strong>Teatro Auditorio de Belgrano</strong> donde se realizará una competencia de danzas con la Escuela de Danza y Arte Agustina Spera.
      </div>
      <div class="campos">
        <div class="campo">
          <span class="campo-label">Nombre y apellido del alumno/a</span>
          <span class="campo-valor">${alumno}</span>
        </div>
        <div class="campo">
          <span class="campo-label">Nombre y apellido del responsable</span>
          <span class="campo-valor">${responsable}</span>
        </div>
        <div class="campo">
          <span class="campo-label">DNI del responsable</span>
          <span class="campo-valor">${dni}</span>
        </div>
      </div>
    </div>
    <div class="footer">
      <p>Esta autorización fue enviada desde <span>danzayarte.com.ar</span></p>
      <p style="margin-top:6px">Escuela de Danza y Arte Agustina Spera — Lugano, Buenos Aires</p>
    </div>
  </div>
</body>
</html>
`
}

export async function POST(req: NextRequest) {
  try {
    const { alumno, responsable, dni, emailResponsable } = await req.json()

    if (!alumno || !responsable || !dni || !emailResponsable) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios.' }, { status: 400 })
    }

    const subject = `Autorización — ${alumno} — Competencia 5 de julio`
    const html = buildEmailHTML(alumno, responsable, dni)

    // Mail al responsable
    await transporter.sendMail({
      from: `"Escuela Agustina Spera" <${process.env.GMAIL_USER}>`,
      to: emailResponsable,
      subject,
      html,
    })

    // Copias a la escuela
    await transporter.sendMail({
      from: `"Escuela Agustina Spera" <${process.env.GMAIL_USER}>`,
      to: ['uriel.martinez.elias@gmail.com', 'danzayartelugano@gmail.com'],
      subject: `[COPIA] ${subject}`,
      html,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error enviando mail:', error)
    return NextResponse.json({ error: 'Error al enviar. Intentá de nuevo.' }, { status: 500 })
  }
}
