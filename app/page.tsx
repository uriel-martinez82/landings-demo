'use client'

import { useState } from 'react'

type Estado = 'idle' | 'enviando' | 'exito' | 'error'

export default function Home() {
  const [form, setForm] = useState({
    alumno: '',
    responsable: '',
    dni: '',
    emailResponsable: '',
  })
  const [estado, setEstado] = useState<Estado>('idle')
  const [mensajeError, setMensajeError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEstado('enviando')
    setMensajeError('')

    try {
      const res = await fetch('/api/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Error desconocido')
      setEstado('exito')
    } catch (err: unknown) {
      setEstado('error')
      setMensajeError(err instanceof Error ? err.message : 'Error al enviar.')
    }
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FAF7F2' }}>

      {/* Header */}
      <header style={{
        backgroundColor: '#1A1410',
        padding: '28px 24px',
        textAlign: 'center',
        borderBottom: '3px solid #C9A84C',
      }}>
        <p style={{ color: '#C9A84C', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 8px', fontFamily: 'sans-serif' }}>
          Escuela de Danza y Arte
        </p>
        <h1 style={{ color: '#FAF7F2', fontFamily: 'Georgia, serif', fontSize: 'clamp(22px, 5vw, 32px)', margin: '0', fontWeight: '400', letterSpacing: '1px' }}>
          Agustina Spera
        </h1>
        <div style={{ width: '48px', height: '1px', backgroundColor: '#C9A84C', margin: '16px auto 0' }} />
      </header>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '52px 24px 40px' }}>
        <p style={{ color: '#C9A84C', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', fontFamily: 'sans-serif', margin: '0 0 16px' }}>
          Competencia de Danzas · 5 de julio
        </p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px, 6vw, 42px)', color: '#1A1410', margin: '0 0 20px', fontWeight: '400', lineHeight: '1.2' }}>
          Nota de Autorización
        </h2>
        <p style={{ color: '#6B5E4E', fontSize: '15px', maxWidth: '520px', margin: '0 auto', lineHeight: '1.7', fontFamily: 'sans-serif' }}>
          Completá el formulario para autorizar la participación de tu hija en la competencia que se realizará en el <strong style={{ color: '#1A1410' }}>Teatro Auditorio de Belgrano</strong>.
        </p>
      </section>

      {/* Nota preview */}
      <section style={{ maxWidth: '620px', margin: '0 auto 48px', padding: '0 24px' }}>
        <div style={{
          background: '#fff',
          border: '1px solid #E8DCC8',
          borderLeft: '4px solid #C9A84C',
          padding: '28px 32px',
          fontFamily: 'Georgia, serif',
          fontSize: '16px',
          lineHeight: '1.9',
          color: '#1A1410',
          borderRadius: '2px',
        }}>
          <p style={{ margin: 0 }}>
            Autorizo a mi hija <span style={{ borderBottom: '1px dashed #C9A84C', color: '#8B6914', paddingBottom: '1px' }}>
              {form.alumno || '______________________'}
            </span> a concurrir el <strong>5 de julio</strong> al <strong>Teatro Auditorio de Belgrano</strong> donde se realizará una competencia de danzas con la Escuela de Danza y Arte Agustina Spera.
          </p>
        </div>
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#9B8B7A', marginTop: '10px', fontFamily: 'sans-serif', letterSpacing: '1px' }}>
          ↑ LA NOTA SE COMPLETA EN TIEMPO REAL
        </p>
      </section>

      {/* Formulario o estado final */}
      {estado === 'exito' ? (
        <section style={{ maxWidth: '520px', margin: '0 auto 80px', padding: '0 24px', textAlign: 'center' }}>
          <div style={{
            background: '#fff',
            border: '1px solid #C9A84C',
            padding: '48px 32px',
            borderRadius: '2px',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>✓</div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#1A1410', margin: '0 0 12px', fontWeight: '400' }}>
              Autorización enviada
            </h3>
            <p style={{ color: '#6B5E4E', fontSize: '14px', lineHeight: '1.7', fontFamily: 'sans-serif', margin: 0 }}>
              Revisá tu correo electrónico. Te enviamos una copia de la autorización firmada para que la tengas guardada.
            </p>
            <div style={{ width: '40px', height: '1px', backgroundColor: '#C9A84C', margin: '24px auto 0' }} />
            <p style={{ color: '#9B8B7A', fontSize: '12px', fontFamily: 'sans-serif', marginTop: '16px' }}>
              Escuela de Danza y Arte Agustina Spera
            </p>
          </div>
        </section>
      ) : (
        <section style={{ maxWidth: '520px', margin: '0 auto 80px', padding: '0 24px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div>
              <label style={labelStyle}>Nombre y apellido del alumno/a</label>
              <input
                name="alumno"
                value={form.alumno}
                onChange={handleChange}
                placeholder="Ej: Valentina García"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Nombre y apellido del responsable</label>
              <input
                name="responsable"
                value={form.responsable}
                onChange={handleChange}
                placeholder="Ej: María García"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>DNI del responsable</label>
              <input
                name="dni"
                value={form.dni}
                onChange={handleChange}
                placeholder="Ej: 28.456.789"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Tu correo electrónico</label>
              <input
                name="emailResponsable"
                type="email"
                value={form.emailResponsable}
                onChange={handleChange}
                placeholder="para recibir la copia"
                required
                style={inputStyle}
              />
              <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#9B8B7A', fontFamily: 'sans-serif' }}>
                Te llegará una copia de la autorización completa.
              </p>
            </div>

            {estado === 'error' && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '12px 16px', borderRadius: '2px', fontSize: '14px', color: '#991B1B', fontFamily: 'sans-serif' }}>
                {mensajeError}
              </div>
            )}

            <button
              type="submit"
              disabled={estado === 'enviando'}
              style={{
                backgroundColor: estado === 'enviando' ? '#9B8B7A' : '#1A1410',
                color: '#C9A84C',
                border: 'none',
                padding: '16px 32px',
                fontFamily: 'Georgia, serif',
                fontSize: '15px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                cursor: estado === 'enviando' ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                marginTop: '8px',
              }}
            >
              {estado === 'enviando' ? 'Enviando...' : 'Firmar y enviar autorización'}
            </button>
          </form>
        </section>
      )}

      {/* Footer */}
      <footer style={{
        backgroundColor: '#1A1410',
        padding: '24px',
        textAlign: 'center',
        borderTop: '1px solid #2A1F15',
      }}>
        <p style={{ color: '#6B5E4E', fontSize: '12px', fontFamily: 'sans-serif', margin: 0 }}>
          © 2025 Escuela de Danza y Arte Agustina Spera · Lugano, Buenos Aires
        </p>
      </footer>

    </main>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: '#6B5E4E',
  fontFamily: 'sans-serif',
  marginBottom: '8px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  border: '1px solid #D4C4A8',
  backgroundColor: '#fff',
  fontSize: '15px',
  fontFamily: 'sans-serif',
  color: '#1A1410',
  outline: 'none',
  borderRadius: '2px',
  transition: 'border-color 0.2s',
}
