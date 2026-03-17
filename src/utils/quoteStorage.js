import { v4 as uuidv4 } from 'uuid'
import { createEmptyItem, createEmptyParty, createQuote } from './quoteFactories'
import {
  normalizeStoredNumber,
  sanitizeParty,
} from './quoteValidation'

export const STORAGE_KEY = 'quote-generator-storage'

export const sanitizeStoredQuotes = (storedQuotes) => {
  if (!Array.isArray(storedQuotes) || storedQuotes.length === 0) {
    return [createQuote()]
  }

  const sanitizedQuotes = storedQuotes
    .filter((quote) => quote && typeof quote === 'object')
    .map((quote) => {
      const baseQuote = createQuote()
      const sanitizedItems =
        Array.isArray(quote.items) && quote.items.length > 0
          ? quote.items
              .filter((item) => item && typeof item === 'object')
              .map((item) => ({
                id: item.id ?? uuidv4(),
                description:
                  typeof item.description === 'string' ? item.description : '',
                quantity: normalizeStoredNumber(item.quantity),
                unitPrice: normalizeStoredNumber(item.unitPrice),
              }))
          : [createEmptyItem()]

      return {
        ...baseQuote,
        ...quote,
        quoteNumber:
          typeof quote.quoteNumber === 'string'
            ? quote.quoteNumber
            : baseQuote.quoteNumber,
        issueDate:
          typeof quote.issueDate === 'string'
            ? quote.issueDate
            : baseQuote.issueDate,
        validUntil:
          typeof quote.validUntil === 'string' ? quote.validUntil : '',
        notes: typeof quote.notes === 'string' ? quote.notes : baseQuote.notes,
        issuer: { ...createEmptyParty(), ...sanitizeParty(quote.issuer) },
        client: { ...createEmptyParty(), ...sanitizeParty(quote.client) },
        taxRate: normalizeStoredNumber(
          quote.taxRate,
          baseQuote.taxRate,
        ),
        items: sanitizedItems.length > 0 ? sanitizedItems : [createEmptyItem()],
      }
    })

  return sanitizedQuotes.length > 0 ? sanitizedQuotes : [createQuote()]
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
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes))
    return true
  } catch {
    return false
  }
}
