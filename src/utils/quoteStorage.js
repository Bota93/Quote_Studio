import { v4 as uuidv4 } from 'uuid'
import { createEmptyItem, createEmptyParty, createQuote } from './quoteFactories'
import {
  normalizeStoredNumber,
  sanitizeParty,
} from './quoteValidation'

export const STORAGE_KEY = 'quote-generator-storage'
const DEFAULT_QUOTE_STATE = () => {
  const initialQuote = createQuote()

  return {
    quotes: [initialQuote],
    selectedQuoteId: initialQuote.id,
  }
}

const resolveSelectedQuoteId = (quotes, selectedQuoteId) =>
  quotes.some((quote) => quote.id === selectedQuoteId)
    ? selectedQuoteId
    : quotes[0]?.id ?? null

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

export const sanitizeStoredQuoteState = (storedState) => {
  if (Array.isArray(storedState)) {
    const quotes = sanitizeStoredQuotes(storedState)

    return {
      quotes,
      selectedQuoteId: resolveSelectedQuoteId(quotes, storedState[0]?.id),
    }
  }

  if (!storedState || typeof storedState !== 'object') {
    return DEFAULT_QUOTE_STATE()
  }

  const quotes = sanitizeStoredQuotes(storedState.quotes)

  return {
    quotes,
    selectedQuoteId: resolveSelectedQuoteId(quotes, storedState.selectedQuoteId),
  }
}

export const loadQuotesState = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_QUOTE_STATE()
  }

  try {
    const rawValue = localStorage.getItem(STORAGE_KEY)

    return rawValue
      ? sanitizeStoredQuoteState(JSON.parse(rawValue))
      : DEFAULT_QUOTE_STATE()
  } catch {
    return DEFAULT_QUOTE_STATE()
  }
}

export const saveQuotesState = (quoteState) => {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    const sanitizedState = sanitizeStoredQuoteState(quoteState)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedState))
    return true
  } catch {
    return false
  }
}
