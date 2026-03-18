import test from 'node:test'
import assert from 'node:assert/strict'
import { getQuoteValidationSummary, isValidEmail, isValidPhone, isValidTaxId } from './quoteValidation.js'

test('accepts valid contact fields', () => {
  assert.equal(isValidEmail('hola@empresa.es'), true)
  assert.equal(isValidPhone('+34 600 123 123'), true)
  assert.equal(isValidTaxId('12345678Z'), true)
})

test('flags invalid contact fields in the validation summary', () => {
  const summary = getQuoteValidationSummary({
    quoteNumber: 'PRES-20260318-123',
    issueDate: '2026-03-18',
    validUntil: '2026-03-20',
    issuer: {
      name: 'Mi Empresa',
      taxId: 'INVALIDO',
      email: 'correo-malo',
      phone: '123',
    },
    client: {
      name: '',
      taxId: '',
      email: '',
      phone: '',
    },
    items: [
      {
        description: '',
        quantity: 0,
        unitPrice: 10,
      },
    ],
  })

  assert.match(summary.issuer.taxId, /NIF, NIE o CIF/u)
  assert.match(summary.issuer.email, /email/u)
  assert.match(summary.issuer.phone, /telefono/u)
  assert.match(summary.client.name, /cliente/u)
  assert.match(summary.items.lines, /linea/u)
  assert.equal(summary.hasBlockingIssues, true)
})

test('flags validUntil earlier than issueDate', () => {
  const summary = getQuoteValidationSummary({
    quoteNumber: 'PRES-20260318-123',
    issueDate: '2026-03-18',
    validUntil: '2026-03-10',
    issuer: { name: 'Mi Empresa', taxId: '', email: '', phone: '' },
    client: { name: 'Cliente', taxId: '', email: '', phone: '' },
    items: [
      {
        description: 'Servicio',
        quantity: 1,
        unitPrice: 100,
      },
    ],
  })

  assert.match(summary.meta.validUntil, /anterior/u)
})
