import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getQuoteTotals } from '../utils/quoteCalculations'
import { createEmptyItem, createQuote } from '../utils/quoteFactories'
import { loadQuotes, loadSelectedQuoteId, saveQuotes } from '../utils/quoteStorage'
import { normalizeOptionalNumberInput } from '../utils/quoteValidation'

export const useQuotesState = () => {
  const [quotes, setQuotes] = useState(loadQuotes)
  const [selectedQuoteId, setSelectedQuoteId] = useState(loadSelectedQuoteId)
  const [storageError, setStorageError] = useState('')

  const activeQuote = quotes.find((quote) => quote.id === selectedQuoteId) ?? quotes[0]
  const totals = getQuoteTotals(activeQuote)

  const persistQuotes = (nextQuotes) => {
    const wasSaved = saveQuotes(nextQuotes)
    setStorageError(
      wasSaved
        ? ''
        : 'No se pudieron guardar los cambios en este navegador.',
    )
  }

  const updateActiveQuote = (updater) => {
    setQuotes((currentQuotes) => {
      const nextQuotes = currentQuotes.map((quote) =>
        quote.id === activeQuote.id ? updater(quote) : quote,
      )

      persistQuotes(nextQuotes)
      return nextQuotes
    })
  }

  const updateField = (field, value) => {
    updateActiveQuote((quote) => ({
      ...quote,
      [field]:
        field === 'taxRate'
          ? normalizeOptionalNumberInput(value)
          : value,
    }))
  }

  const updatePartyField = (party, field, value) => {
    updateActiveQuote((quote) => ({
      ...quote,
      [party]: {
        ...quote[party],
        [field]: value,
      },
    }))
  }

  const updateItem = (itemId, field, value) => {
    updateActiveQuote((quote) => ({
      ...quote,
      items: quote.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]:
                field === 'description'
                  ? value
                  : normalizeOptionalNumberInput(value),
            }
          : item,
      ),
    }))
  }

  const addItem = () => {
    updateActiveQuote((quote) => ({
      ...quote,
      items: [...quote.items, createEmptyItem()],
    }))
  }

  const removeItem = (itemId) => {
    updateActiveQuote((quote) => ({
      ...quote,
      items:
        quote.items.length === 1
          ? quote.items
          : quote.items.filter((item) => item.id !== itemId),
    }))
  }

  const createNewQuote = () => {
    const nextQuote = createQuote()
    setQuotes((currentQuotes) => {
      const nextQuotes = [nextQuote, ...currentQuotes]
      persistQuotes(nextQuotes)
      return nextQuotes
    })
    setSelectedQuoteId(nextQuote.id)
  }

  const duplicateQuote = () => {
    const duplicatedQuote = {
      ...activeQuote,
      id: uuidv4(),
      quoteNumber: `${activeQuote.quoteNumber}-COPY`,
      items: activeQuote.items.map((item) => ({ ...item, id: uuidv4() })),
    }

    setQuotes((currentQuotes) => {
      const nextQuotes = [duplicatedQuote, ...currentQuotes]
      persistQuotes(nextQuotes)
      return nextQuotes
    })
    setSelectedQuoteId(duplicatedQuote.id)
  }

  const deleteQuote = () => {
    if (quotes.length === 1) {
      const nextQuote = createQuote()
      setQuotes([nextQuote])
      persistQuotes([nextQuote])
      setSelectedQuoteId(nextQuote.id)
      return
    }

    const fallbackQuoteId =
      quotes.find((quote) => quote.id !== activeQuote.id)?.id ?? null

    setQuotes((currentQuotes) => {
      const nextQuotes = currentQuotes.filter(
        (quote) => quote.id !== activeQuote.id,
      )
      persistQuotes(nextQuotes)
      return nextQuotes
    })
    setSelectedQuoteId(fallbackQuoteId)
  }

  return {
    quotes,
    selectedQuoteId,
    setSelectedQuoteId,
    activeQuote,
    totals,
    updateField,
    updatePartyField,
    updateItem,
    addItem,
    removeItem,
    createNewQuote,
    duplicateQuote,
    deleteQuote,
    storageError,
  }
}
