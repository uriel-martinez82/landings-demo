import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fs from 'fs'
import path from 'path'

const GOLD = rgb(0.788, 0.659, 0.298) // #C9A84C
const INK = rgb(0.102, 0.078, 0.063) // #1A1410
const MUTED = rgb(0.420, 0.369, 0.306) // #6B5E4E

export async function generarAutorizacionPDF(
  alumno: string,
  responsable: string,
  dni: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595.28, 841.89]) // A4
  const { width, height } = page.getSize()

  const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
  const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic)

  // Logo
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo.png')
    const logoBytes = fs.readFileSync(logoPath)
    const logoImage = await pdfDoc.embedPng(logoBytes)
    const logoWidth = 90
    const logoHeight = (logoImage.height / logoImage.width) * logoWidth
    page.drawImage(logoImage, {
      x: (width - logoWidth) / 2,
      y: height - 110,
      width: logoWidth,
      height: logoHeight,
    })
  } catch (e) {
    console.error('No se pudo cargar el logo para el PDF:', e)
  }

  // Encabezado de texto
  const headerY = height - 130
  const eyebrowText = 'ESCUELA DE DANZA Y ARTE'
  const eyebrowWidth = fontRegular.widthOfTextAtSize(eyebrowText, 9)
  page.drawText(eyebrowText, {
    x: (width - eyebrowWidth) / 2,
    y: headerY,
    size: 9,
    font: fontRegular,
    color: MUTED,
  })

  const titleText = 'Agustina Spera'
  const titleWidth = fontBold.widthOfTextAtSize(titleText, 20)
  page.drawText(titleText, {
    x: (width - titleWidth) / 2,
    y: headerY - 26,
    size: 20,
    font: fontBold,
    color: INK,
  })

  // Línea dorada
  page.drawLine({
    start: { x: width / 2 - 24, y: headerY - 40 },
    end: { x: width / 2 + 24, y: headerY - 40 },
    thickness: 1,
    color: GOLD,
  })

  // Título del documento
  const docTitle = 'NOTA DE AUTORIZACIÓN'
  const docTitleWidth = fontBold.widthOfTextAtSize(docTitle, 13)
  page.drawText(docTitle, {
    x: (width - docTitleWidth) / 2,
    y: headerY - 75,
    size: 13,
    font: fontBold,
    color: INK,
  })

  const subtitle = 'Competencia de Danzas · 5 de julio · Teatro Auditorio de Belgrano'
  const subtitleWidth = fontRegular.widthOfTextAtSize(subtitle, 9)
  page.drawText(subtitle, {
    x: (width - subtitleWidth) / 2,
    y: headerY - 92,
    size: 9,
    font: fontRegular,
    color: MUTED,
  })

  // Cuerpo de la nota (texto justificado simple con wrap manual)
  const bodyY = headerY - 150
  const marginX = 70
  const maxWidth = width - marginX * 2
  const fontSize = 12.5
  const lineHeight = 22

  const parts: { text: string; bold?: boolean; italic?: boolean }[] = [
    { text: 'Autorizo a mi hija ' },
    { text: alumno, italic: true, bold: true },
    { text: ' a concurrir el ' },
    { text: '5 de julio', bold: true },
    { text: ' al ' },
    { text: 'Teatro Auditorio de Belgrano', bold: true },
    { text: ' donde se realizará una competencia de danzas con la Escuela de Danza y Arte Agustina Spera.' },
  ]

  // Construir líneas con wrap, soportando estilos por palabra
  type Word = { text: string; bold?: boolean; italic?: boolean }
  const words: Word[] = []
  parts.forEach((part) => {
    part.text.split(' ').forEach((w, idx, arr) => {
      if (w === '') return
      words.push({ text: idx < arr.length - 1 ? w + ' ' : w + ' ', bold: part.bold, italic: part.italic })
    })
  })

  const getFont = (w: Word) => (w.bold ? fontBold : w.italic ? fontItalic : fontRegular)

  let line: Word[] = []
  let lineWidth = 0
  const lines: Word[][] = []

  words.forEach((w) => {
    const wWidth = getFont(w).widthOfTextAtSize(w.text, fontSize)
    if (lineWidth + wWidth > maxWidth) {
      lines.push(line)
      line = []
      lineWidth = 0
    }
    line.push(w)
    lineWidth += wWidth
  })
  if (line.length) lines.push(line)

  let currentY = bodyY
  lines.forEach((lineWords) => {
    let x = marginX
    lineWords.forEach((w) => {
      const font = getFont(w)
      page.drawText(w.text, { x, y: currentY, size: fontSize, font, color: INK })
      x += font.widthOfTextAtSize(w.text, fontSize)
    })
    currentY -= lineHeight
  })

  // Caja de datos del responsable
  const boxY = currentY - 50
  const boxHeight = 90
  page.drawRectangle({
    x: marginX,
    y: boxY - boxHeight,
    width: maxWidth,
    height: boxHeight,
    borderColor: GOLD,
    borderWidth: 1,
    color: rgb(0.984, 0.969, 0.949),
  })

  const drawCampo = (label: string, value: string, y: number) => {
    page.drawText(label.toUpperCase(), {
      x: marginX + 20,
      y,
      size: 8,
      font: fontRegular,
      color: MUTED,
    })
    page.drawText(value, {
      x: marginX + 20,
      y: y - 16,
      size: 12,
      font: fontBold,
      color: INK,
    })
  }

  drawCampo('Nombre y apellido del responsable', responsable, boxY - 25)
  drawCampo('DNI del responsable', dni, boxY - 65)

  // Footer
  const footerText = 'Escuela de Danza y Arte Agustina Spera · Lugano, Buenos Aires'
  const footerWidth = fontRegular.widthOfTextAtSize(footerText, 8)
  page.drawText(footerText, {
    x: (width - footerWidth) / 2,
    y: 50,
    size: 8,
    font: fontRegular,
    color: MUTED,
  })

  const fecha = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const fechaText = `Generado el ${fecha}`
  const fechaWidth = fontRegular.widthOfTextAtSize(fechaText, 7)
  page.drawText(fechaText, {
    x: (width - fechaWidth) / 2,
    y: 38,
    size: 7,
    font: fontRegular,
    color: MUTED,
  })

  return pdfDoc.save()
}
