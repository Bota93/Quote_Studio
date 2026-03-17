import { v4 as uuidv4 } from 'uuid'

export const DEFAULT_TAX_RATE = 21

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
