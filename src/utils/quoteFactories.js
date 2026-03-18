import { v4 as uuidv4 } from 'uuid'

export const DEFAULT_TAX_RATE = 21

const createQuoteNumber = () => {
  const today = new Date().toISOString().slice(0, 10)

  return `PRES-${today.replaceAll('-', '')}-${Math.floor(Math.random() * 900 + 100)}`
}

export const createEmptyParty = () => ({
  name: '',
  taxId: '',
  email: '',
  phone: '',
  address: '',
})

export const createEmptyItem = () => ({
  id: uuidv4(),
  description: '',
  quantity: 1,
  unitPrice: 0,
})

export const createQuote = () => {
  const today = new Date().toISOString().slice(0, 10)

  return {
    id: uuidv4(),
    quoteNumber: createQuoteNumber(),
    issueDate: today,
    validUntil: '',
    notes: '',
    issuer: createEmptyParty(),
    client: createEmptyParty(),
    taxRate: DEFAULT_TAX_RATE,
    items: [createEmptyItem()],
  }
}
