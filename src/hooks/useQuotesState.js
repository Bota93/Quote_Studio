import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getQuoteTotals } from '../utils/quoteCalculations'
import { createEmptyItem, createQuote } from '../utils/quoteFactories'
import { loadQuotes, loadSelectedQuoteId, saveQuotes } from '../utils/quoteStorage'

export const useQuotesState = () => {
  const [quotes, setQuotes] = useState(loadQuotes)
  const [selectedQuoteId, setSelectedQuoteId] = useState(loadSelectedQuoteId)

  useEffect(() => {
    saveQuotes(quotes)
  }, [quotes])

  const activeQuote = quotes.find((quote) => quote.id === selectedQuoteId) ?? quotes[0]
  const totals = getQuoteTotals(activeQuote)

  const updateActiveQuote = (updater) => {
    setQuotes((currentQuotes) =>
      currentQuotes.map((quote) =>
        quote.id === activeQuote.id ? updater(quote) : quote,
      ),
    )
  }

  const updateField = (field, value) => {
    updateActiveQuote((quote) => ({ ...quote, [field]: value }))
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
                  : value === ''
                    ? ''
                    : Number(value),
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
  }
}
