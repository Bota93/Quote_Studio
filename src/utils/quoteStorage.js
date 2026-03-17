import { v4 as uuidv4 } from 'uuid'
import { createEmptyItem, createEmptyParty, createQuote } from './quoteFactories'

export const STORAGE_KEY = 'quote-generator-storage'

export const sanitizeStoredQuotes = (storedQuotes) => {
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

export const loadQuotes = () => {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY)
    return rawValue ? sanitizeStoredQuotes(JSON.parse(rawValue)) : [createQuote()]
  } catch {
    return [createQuote()]
  }
}

export const loadSelectedQuoteId = () => {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY)
    const storedQuotes = rawValue ? JSON.parse(rawValue) : null
    return storedQuotes?.[0]?.id ?? null
  } catch {
    return null
  }
}

export const saveQuotes = (quotes) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes))
}
