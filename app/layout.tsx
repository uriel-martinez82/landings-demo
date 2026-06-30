import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Autorización — Escuela de Danza y Arte Agustina Spera',
  description: 'Formulario de autorización para la competencia de danzas — Teatro Auditorio de Belgrano, 5 de julio.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
