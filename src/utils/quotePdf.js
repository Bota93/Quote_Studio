import { getItemTotal } from './quoteCalculations'
import { validateQuoteForExport } from './quoteExportValidation'
import { buildPartyLines, formatCurrency } from './quoteFormatters'

export const exportQuoteToPdf = async (quote, totals) => {
  const validationError = validateQuoteForExport(quote)

  if (validationError) {
    throw new Error(validationError)
  }

  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 48
  const contentWidth = pageWidth - margin * 2
  let cursorY = margin

  const ensureSpace = (requiredHeight = 24) => {
    if (cursorY + requiredHeight <= pageHeight - margin) {
      return
    }

    doc.addPage()
    cursorY = margin
  }

  const writeLabel = (text, x, y) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(106, 114, 128)
    doc.text(text.toUpperCase(), x, y)
  }

  const writeBody = (text, x, y, options = {}) => {
    doc.setFont('helvetica', options.bold ? 'bold' : 'normal')
    doc.setFontSize(options.size ?? 11)
    doc.setTextColor(17, 24, 39)
    doc.text(text, x, y)
  }

  doc.setFillColor(15, 23, 42)
  doc.roundedRect(margin, cursorY, contentWidth, 102, 18, 18, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  doc.setTextColor(255, 255, 255)
  doc.text('Presupuesto', margin + 24, cursorY + 38)
  doc.setFontSize(12)
  doc.text(quote.quoteNumber, margin + 24, cursorY + 62)
  doc.setFont('helvetica', 'normal')
  doc.text(`Fecha: ${quote.issueDate || '-'}`, margin + 24, cursorY + 82)
  doc.text(`Valido hasta: ${quote.validUntil || '-'}`, margin + 200, cursorY + 82)
  cursorY += 138

  const issuerLines = buildPartyLines(quote.issuer)
  const clientLines = buildPartyLines(quote.client)
  writeLabel('Emisor', margin, cursorY)
  writeLabel('Cliente', margin + contentWidth / 2, cursorY)
  cursorY += 20

  const columnWidth = contentWidth / 2 - 16
  const writeMultilineBlock = (lines, x) => {
    let localY = cursorY
    lines.forEach((line) => {
      const split = doc.splitTextToSize(line, columnWidth)
      split.forEach((piece) => {
        writeBody(piece, x, localY)
        localY += 16
      })
    })
    return localY
  }

  const issuerBottom = writeMultilineBlock(issuerLines, margin)
  const clientBottom = writeMultilineBlock(clientLines, margin + contentWidth / 2)
  cursorY = Math.max(issuerBottom, clientBottom) + 18

  ensureSpace(40)
  doc.setDrawColor(226, 232, 240)
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(margin, cursorY, contentWidth, 28, 8, 8, 'FD')
  writeLabel('Concepto', margin + 12, cursorY + 18)
  writeLabel('Cant.', margin + 290, cursorY + 18)
  writeLabel('Precio', margin + 360, cursorY + 18)
  writeLabel('Importe', margin + 456, cursorY + 18)
  cursorY += 42

  quote.items.forEach((item) => {
    const descriptionLines = doc.splitTextToSize(item.description || 'Servicio', 250)
    const rowHeight = Math.max(28, descriptionLines.length * 16 + 8)
    ensureSpace(rowHeight + 8)

    doc.setDrawColor(226, 232, 240)
    doc.line(margin, cursorY + rowHeight, margin + contentWidth, cursorY + rowHeight)

    descriptionLines.forEach((line, index) => {
      writeBody(line, margin + 12, cursorY + 18 + index * 16)
    })
    writeBody(String(item.quantity || 0), margin + 290, cursorY + 18)
    writeBody(formatCurrency(item.unitPrice), margin + 360, cursorY + 18)
    writeBody(formatCurrency(getItemTotal(item)), margin + 456, cursorY + 18)
    cursorY += rowHeight
  })

  cursorY += 20
  ensureSpace(90)
  const totalsBoxWidth = 220
  const totalsX = margin + contentWidth - totalsBoxWidth

  doc.setFillColor(248, 250, 252)
  doc.roundedRect(totalsX, cursorY, totalsBoxWidth, 84, 10, 10, 'F')
  writeLabel('Subtotal', totalsX + 16, cursorY + 22)
  writeBody(formatCurrency(totals.subtotal), totalsX + 130, cursorY + 22)
  writeLabel(`IVA (${quote.taxRate || 0}%)`, totalsX + 16, cursorY + 44)
  writeBody(formatCurrency(totals.taxAmount), totalsX + 130, cursorY + 44)
  writeLabel('Total', totalsX + 16, cursorY + 68)
  writeBody(formatCurrency(totals.total), totalsX + 130, cursorY + 68, {
    bold: true,
    size: 13,
  })
  cursorY += 118

  const noteLines = doc.splitTextToSize(
    quote.notes || 'Sin observaciones adicionales.',
    contentWidth,
  )
  ensureSpace(noteLines.length * 14 + 28)
  writeLabel('Notas', margin, cursorY)
  cursorY += 18
  noteLines.forEach((line, index) => {
    writeBody(line, margin, cursorY + index * 14)
  })

  const safeFileName = String(quote.quoteNumber || 'presupuesto')
    .trim()
    .split('')
    .map((character) => {
      const charCode = character.charCodeAt(0)
      const isControlCharacter = charCode >= 0 && charCode <= 31
      const isReservedCharacter = '<>:"/\\|?*'.includes(character)

      return isControlCharacter || isReservedCharacter ? '-' : character
    })
    .join('')

  doc.save(`${safeFileName || 'presupuesto'}.pdf`)
}
