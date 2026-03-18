import test from 'node:test'
import assert from 'node:assert/strict'
import { validateQuoteForExport } from './quoteExportValidation.js'

test('returns an empty string when the quote is ready for export', () => {
  const result = validateQuoteForExport({
    quoteNumber: 'PRES-20260318-123',
    issueDate: '2026-03-18',
    validUntil: '2026-03-20',
    issuer: { name: 'Mi Empresa', taxId: '', email: '', phone: '' },
    client: { name: 'Cliente', taxId: '', email: '', phone: '' },
    items: [
      {
        description: 'Servicio principal',
        quantity: 1,
        unitPrice: 250,
      },
    ],
  })

  assert.equal(result, '')
})

test('returns the first blocking export issue when data is incomplete', () => {
  const result = validateQuoteForExport({
    quoteNumber: '',
    issueDate: '',
    validUntil: '',
    issuer: { name: '', taxId: '', email: '', phone: '' },
    client: { name: '', taxId: '', email: '', phone: '' },
    items: [],
  })

  assert.match(result, /numero de presupuesto/u)
})
