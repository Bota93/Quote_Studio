import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'quote-generator-storage'
const DEFAULT_TAX_RATE = 21

const createEmptyParty = () => ({
  name: '',
  taxId: '',
  email: '',
  phone: '',
  address: '',
})

const createEmptyItem = () => ({
  id: uuidv4(),
  description: '',
  quantity: 1,
  unitPrice: 0,
})

const createQuote = () => {
  const today = new Date().toISOString().slice(0, 10)

  return {
    id: uuidv4(),
    quoteNumber: `PRES-${today.replaceAll('-', '')}-${Math.floor(Math.random() * 900 + 100)}`,
    issueDate: today,
    validUntil: '',
    notes: 'Forma de pago: transferencia bancaria a 15 dias.',
    issuer: {
      ...createEmptyParty(),
      name: 'Estudio Aurora',
      taxId: 'B-12345678',
      email: 'hola@estudioaurora.es',
      phone: '+34 600 123 456',
      address: 'Calle Gran Via 18, Madrid',
    },
    client: createEmptyParty(),
    taxRate: DEFAULT_TAX_RATE,
    items: [
      {
        id: uuidv4(),
        description: 'Diseno y desarrollo de landing page',
        quantity: 1,
        unitPrice: 850,
      },
    ],
  }
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(value) || 0)

const getItemTotal = (item) => {
  const quantity = Number(item.quantity) || 0
  const unitPrice = Number(item.unitPrice) || 0

  return quantity * unitPrice
}

const getQuoteTotals = (quote) => {
  const subtotal = quote.items.reduce((sum, item) => sum + getItemTotal(item), 0)
  const taxAmount = subtotal * ((Number(quote.taxRate) || 0) / 100)

  return {
    subtotal,
    taxAmount,
    total: subtotal + taxAmount,
  }
}

const toInputValue = (value) => String(value ?? '')

const sanitizeStoredQuotes = (storedQuotes) => {
  if (!Array.isArray(storedQuotes) || storedQuotes.length === 0) {
    return [createQuote()]
  }

  return storedQuotes.map((quote) => ({
    ...createQuote(),
    ...quote,
    issuer: { ...createEmptyParty(), ...quote.issuer },
    client: { ...createEmptyParty(), ...quote.client },
    items:
      Array.isArray(quote.items) && quote.items.length > 0
        ? quote.items.map((item) => ({
            id: item.id ?? uuidv4(),
            description: item.description ?? '',
            quantity: Number(item.quantity) || 0,
            unitPrice: Number(item.unitPrice) || 0,
          }))
        : [createEmptyItem()],
  }))
}

const buildPartyLines = (party) =>
  [party.name, party.taxId && `NIF/CIF: ${party.taxId}`, party.address, party.email, party.phone].filter(Boolean)

function App() {
  const [quotes, setQuotes] = useState(() => {
    try {
      const rawValue = localStorage.getItem(STORAGE_KEY)
      return rawValue ? sanitizeStoredQuotes(JSON.parse(rawValue)) : [createQuote()]
    } catch {
      return [createQuote()]
    }
  })
  const [selectedQuoteId, setSelectedQuoteId] = useState(() => {
    try {
      const rawValue = localStorage.getItem(STORAGE_KEY)
      const storedQuotes = rawValue ? JSON.parse(rawValue) : null
      return storedQuotes?.[0]?.id ?? null
    } catch {
      return null
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes))
  }, [quotes])

  const activeQuote = quotes.find((quote) => quote.id === selectedQuoteId) ?? quotes[0]
  const totals = getQuoteTotals(activeQuote)

  const updateQuote = (updater) => {
    setQuotes((currentQuotes) =>
      currentQuotes.map((quote) =>
        quote.id === activeQuote.id ? updater(quote) : quote,
      ),
    )
  }

  const updateField = (field, value) => {
    updateQuote((quote) => ({ ...quote, [field]: value }))
  }

  const updatePartyField = (party, field, value) => {
    updateQuote((quote) => ({
      ...quote,
      [party]: {
        ...quote[party],
        [field]: value,
      },
    }))
  }

  const updateItem = (itemId, field, value) => {
    updateQuote((quote) => ({
      ...quote,
      items: quote.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]:
                field === 'description'
                  ? value
                  : value === ''
                    ? ''
                    : Number(value),
            }
          : item,
      ),
    }))
  }

  const addItem = () => {
    updateQuote((quote) => ({
      ...quote,
      items: [...quote.items, createEmptyItem()],
    }))
  }

  const removeItem = (itemId) => {
    updateQuote((quote) => ({
      ...quote,
      items:
        quote.items.length === 1
          ? quote.items
          : quote.items.filter((item) => item.id !== itemId),
    }))
  }

  const createNewQuote = () => {
    const nextQuote = createQuote()
    setQuotes((currentQuotes) => [nextQuote, ...currentQuotes])
    setSelectedQuoteId(nextQuote.id)
  }

  const duplicateQuote = () => {
    const duplicatedQuote = {
      ...activeQuote,
      id: uuidv4(),
      quoteNumber: `${activeQuote.quoteNumber}-COPY`,
      items: activeQuote.items.map((item) => ({ ...item, id: uuidv4() })),
    }

    setQuotes((currentQuotes) => [duplicatedQuote, ...currentQuotes])
    setSelectedQuoteId(duplicatedQuote.id)
  }

  const deleteQuote = () => {
    if (quotes.length === 1) {
      const nextQuote = createQuote()
      setQuotes([nextQuote])
      setSelectedQuoteId(nextQuote.id)
      return
    }

    setQuotes((currentQuotes) =>
      currentQuotes.filter((quote) => quote.id !== activeQuote.id),
    )
  }

  const exportToPdf = async () => {
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
    doc.text(activeQuote.quoteNumber, margin + 24, cursorY + 62)
    doc.setFont('helvetica', 'normal')
    doc.text(`Fecha: ${activeQuote.issueDate || '-'}`, margin + 24, cursorY + 82)
    doc.text(`Valido hasta: ${activeQuote.validUntil || '-'}`, margin + 200, cursorY + 82)
    cursorY += 138

    const issuerLines = buildPartyLines(activeQuote.issuer)
    const clientLines = buildPartyLines(activeQuote.client)
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

    activeQuote.items.forEach((item) => {
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
    writeLabel(`IVA (${activeQuote.taxRate || 0}%)`, totalsX + 16, cursorY + 44)
    writeBody(formatCurrency(totals.taxAmount), totalsX + 130, cursorY + 44)
    writeLabel('Total', totalsX + 16, cursorY + 68)
    writeBody(formatCurrency(totals.total), totalsX + 130, cursorY + 68, {
      bold: true,
      size: 13,
    })
    cursorY += 118

    const noteLines = doc.splitTextToSize(activeQuote.notes || 'Sin observaciones adicionales.', contentWidth)
    ensureSpace(noteLines.length * 14 + 28)
    writeLabel('Notas', margin, cursorY)
    cursorY += 18
    noteLines.forEach((line, index) => {
      writeBody(line, margin, cursorY + index * 14)
    })

    doc.save(`${activeQuote.quoteNumber || 'presupuesto'}.pdf`)
  }

  const inputClassName =
    'mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-amber-200/70'
  const sectionClassName =
    'rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur'

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.28),_transparent_24%),linear-gradient(180deg,_#fffdf7_0%,_#f8fafc_48%,_#eef2ff_100%)] text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-slate-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.45fr_0.85fr] lg:px-8">
            <div>
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-amber-200">
                Quote Studio
              </span>
              <h1 className="mt-4 font-['Space_Grotesk',_ui-sans-serif,_system-ui] text-4xl font-semibold tracking-[-0.04em] lg:text-6xl">
                Generador de presupuestos profesional para trabajar rapido y bien.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 lg:text-base">
                Crea presupuestos claros, calcula impuestos automaticamente,
                guarda versiones en tu navegador y exporta un PDF listo para
                enviar al cliente.
              </p>
            </div>

            <div className="grid gap-3 rounded-[28px] border border-white/10 bg-white/6 p-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                  Total actual
                </p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  {formatCurrency(totals.total)}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm text-slate-200">
                <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Subtotal
                  </p>
                  <p className="mt-2 font-medium">{formatCurrency(totals.subtotal)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    IVA
                  </p>
                  <p className="mt-2 font-medium">{formatCurrency(totals.taxAmount)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Lineas
                  </p>
                  <p className="mt-2 font-medium">{activeQuote.items.length}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className={`${sectionClassName} h-fit`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Presupuestos
                </p>
                <h2 className="mt-2 font-['Space_Grotesk',_ui-sans-serif,_system-ui] text-2xl font-semibold">
                  Historial local
                </h2>
              </div>
              <button type="button" onClick={createNewQuote} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
                Nuevo
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              {quotes.map((quote) => {
                const quoteTotals = getQuoteTotals(quote)
                const isActive = quote.id === activeQuote.id

                return (
                  <button
                    key={quote.id}
                    type="button"
                    onClick={() => setSelectedQuoteId(quote.id)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      isActive
                        ? 'border-slate-950 bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.24)]'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <p className="text-xs uppercase tracking-[0.18em] opacity-70">{quote.issueDate || 'Sin fecha'}</p>
                    <p className="mt-2 font-semibold">{quote.quoteNumber}</p>
                    <p className="mt-1 text-sm opacity-80">{quote.client.name || 'Cliente pendiente'}</p>
                    <p className="mt-3 text-sm font-medium">{formatCurrency(quoteTotals.total)}</p>
                  </button>
                )
              })}
            </div>
          </aside>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <section className="grid gap-6">
              <div className={sectionClassName}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Configuracion</p>
                    <h2 className="mt-2 font-['Space_Grotesk',_ui-sans-serif,_system-ui] text-2xl font-semibold">Datos principales</h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={duplicateQuote} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                      Duplicar
                    </button>
                    <button type="button" onClick={deleteQuote} className="rounded-2xl border border-rose-200 px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50">
                      Eliminar
                    </button>
                    <button type="button" onClick={exportToPdf} className="rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">
                      Exportar PDF
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <label className="block text-sm font-medium text-slate-700">
                    Numero
                    <input className={inputClassName} value={activeQuote.quoteNumber} onChange={(event) => updateField('quoteNumber', event.target.value)} />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Fecha de emision
                    <input type="date" className={inputClassName} value={activeQuote.issueDate} onChange={(event) => updateField('issueDate', event.target.value)} />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Valido hasta
                    <input type="date" className={inputClassName} value={activeQuote.validUntil} onChange={(event) => updateField('validUntil', event.target.value)} />
                  </label>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {[
                  ['issuer', 'Datos del emisor'],
                  ['client', 'Datos del cliente'],
                ].map(([partyKey, title]) => (
                  <div key={partyKey} className={sectionClassName}>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Identidad</p>
                    <h2 className="mt-2 font-['Space_Grotesk',_ui-sans-serif,_system-ui] text-2xl font-semibold">{title}</h2>

                    <div className="mt-5 grid gap-4">
                      <label className="block text-sm font-medium text-slate-700">
                        Nombre o empresa
                        <input className={inputClassName} value={activeQuote[partyKey].name} onChange={(event) => updatePartyField(partyKey, 'name', event.target.value)} />
                      </label>
                      <label className="block text-sm font-medium text-slate-700">
                        NIF / CIF
                        <input className={inputClassName} value={activeQuote[partyKey].taxId} onChange={(event) => updatePartyField(partyKey, 'taxId', event.target.value)} />
                      </label>
                      <label className="block text-sm font-medium text-slate-700">
                        Email
                        <input type="email" className={inputClassName} value={activeQuote[partyKey].email} onChange={(event) => updatePartyField(partyKey, 'email', event.target.value)} />
                      </label>
                      <label className="block text-sm font-medium text-slate-700">
                        Telefono
                        <input className={inputClassName} value={activeQuote[partyKey].phone} onChange={(event) => updatePartyField(partyKey, 'phone', event.target.value)} />
                      </label>
                      <label className="block text-sm font-medium text-slate-700">
                        Direccion
                        <textarea rows="3" className={inputClassName} value={activeQuote[partyKey].address} onChange={(event) => updatePartyField(partyKey, 'address', event.target.value)} />
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className={sectionClassName}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Servicios</p>
                    <h2 className="mt-2 font-['Space_Grotesk',_ui-sans-serif,_system-ui] text-2xl font-semibold">Lineas del presupuesto</h2>
                  </div>
                  <button type="button" onClick={addItem} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                    Anadir linea
                  </button>
                </div>

                <div className="mt-6 grid gap-4">
                  {activeQuote.items.map((item, index) => (
                    <article key={item.id} className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-700">Linea {index + 1}</p>
                        <button type="button" onClick={() => removeItem(item.id)} disabled={activeQuote.items.length === 1} className="text-sm font-medium text-rose-700 disabled:cursor-not-allowed disabled:opacity-40">
                          Eliminar
                        </button>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_110px_140px_140px]">
                        <label className="block text-sm font-medium text-slate-700 md:col-span-1">
                          Descripcion
                          <textarea rows="3" className={inputClassName} value={item.description} onChange={(event) => updateItem(item.id, 'description', event.target.value)} />
                        </label>
                        <label className="block text-sm font-medium text-slate-700">
                          Cantidad
                          <input type="number" min="0" step="1" className={inputClassName} value={toInputValue(item.quantity)} onChange={(event) => updateItem(item.id, 'quantity', event.target.value)} />
                        </label>
                        <label className="block text-sm font-medium text-slate-700">
                          Precio unitario
                          <input type="number" min="0" step="0.01" className={inputClassName} value={toInputValue(item.unitPrice)} onChange={(event) => updateItem(item.id, 'unitPrice', event.target.value)} />
                        </label>
                        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Importe</p>
                          <p className="mt-3 text-lg font-semibold text-slate-950">{formatCurrency(getItemTotal(item))}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className={`${sectionClassName} grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]`}>
                <label className="block text-sm font-medium text-slate-700">
                  IVA %
                  <input type="number" min="0" step="0.01" className={inputClassName} value={toInputValue(activeQuote.taxRate)} onChange={(event) => updateField('taxRate', event.target.value)} />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Notas / condiciones
                  <textarea rows="4" className={inputClassName} value={activeQuote.notes} onChange={(event) => updateField('notes', event.target.value)} />
                </label>
              </div>
            </section>

            <aside className={`${sectionClassName} h-fit xl:sticky xl:top-6`}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Vista previa</p>
              <h2 className="mt-2 font-['Space_Grotesk',_ui-sans-serif,_system-ui] text-2xl font-semibold">Presupuesto visual</h2>

              <div className="mt-5 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.1)]">
                <div className="bg-slate-950 px-6 py-6 text-white">
                  <p className="text-xs uppercase tracking-[0.22em] text-amber-200">Documento</p>
                  <div className="mt-3 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-['Space_Grotesk',_ui-sans-serif,_system-ui] text-3xl font-semibold">Presupuesto</h3>
                      <p className="mt-2 text-sm text-slate-300">{activeQuote.quoteNumber}</p>
                    </div>
                    <div className="text-right text-xs text-slate-300">
                      <p>Fecha: {activeQuote.issueDate || '-'}</p>
                      <p className="mt-2">Valido hasta: {activeQuote.validUntil || '-'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 px-6 py-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Emisor</p>
                      <div className="mt-3 space-y-1 text-sm text-slate-600">
                        {buildPartyLines(activeQuote.issuer).map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Cliente</p>
                      <div className="mt-3 space-y-1 text-sm text-slate-600">
                        {buildPartyLines(activeQuote.client).length > 0 ? (
                          buildPartyLines(activeQuote.client).map((line) => <p key={line}>{line}</p>)
                        ) : (
                          <p>Pendiente de completar</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-4 py-3 font-medium">Concepto</th>
                          <th className="px-4 py-3 font-medium">Cant.</th>
                          <th className="px-4 py-3 font-medium">Precio</th>
                          <th className="px-4 py-3 font-medium">Importe</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {activeQuote.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-4 text-slate-700">{item.description || 'Servicio sin descripcion'}</td>
                            <td className="px-4 py-4 text-slate-600">{item.quantity || 0}</td>
                            <td className="px-4 py-4 text-slate-600">{formatCurrency(item.unitPrice)}</td>
                            <td className="px-4 py-4 font-medium text-slate-950">{formatCurrency(getItemTotal(item))}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="ml-auto grid w-full max-w-xs gap-3 rounded-2xl bg-slate-50 p-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="font-medium text-slate-900">{formatCurrency(totals.subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">IVA ({activeQuote.taxRate || 0}%)</span>
                      <span className="font-medium text-slate-900">{formatCurrency(totals.taxAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base">
                      <span className="font-semibold text-slate-900">Total</span>
                      <span className="font-semibold text-slate-950">{formatCurrency(totals.total)}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                    <p className="font-medium text-slate-900">Notas</p>
                    <p className="mt-2 whitespace-pre-line">{activeQuote.notes || 'Sin observaciones adicionales.'}</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
