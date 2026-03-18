import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getQuoteTotals } from '../utils/quoteCalculations'
import { createEmptyItem, createQuote } from '../utils/quoteFactories'
import { loadQuotesState, saveQuotesState } from '../utils/quoteStorage'
import { normalizeOptionalNumberInput } from '../utils/quoteValidation'

const resolveActiveQuote = (quoteState) =>
  quoteState.quotes.find((quote) => quote.id === quoteState.selectedQuoteId) ??
  quoteState.quotes[0]

export const useQuotesState = () => {
  const [quoteState, setQuoteState] = useState(loadQuotesState)
  const [storageError, setStorageError] = useState('')

  const activeQuote = resolveActiveQuote(quoteState)
  const totals = getQuoteTotals(activeQuote)

  const persistQuoteState = (nextQuoteState) => {
    const wasSaved = saveQuotesState(nextQuoteState)
    setStorageError(
      wasSaved
        ? ''
        : 'No se pudieron guardar los cambios en este navegador.',
    )
  }

  const commitQuoteState = (updater) => {
    setQuoteState((currentQuoteState) => {
      const nextQuoteState = updater(currentQuoteState)
      persistQuoteState(nextQuoteState)
      return nextQuoteState
    })
  }

  const setSelectedQuoteId = (nextSelectedQuoteId) => {
    commitQuoteState((currentQuoteState) => ({
      ...currentQuoteState,
      selectedQuoteId:
        currentQuoteState.quotes.find((quote) => quote.id === nextSelectedQuoteId)
          ?.id ?? currentQuoteState.selectedQuoteId,
    }))
  }

  const updateActiveQuote = (updater) => {
    commitQuoteState((currentQuoteState) => {
      const currentActiveQuote = resolveActiveQuote(currentQuoteState)

      return {
        ...currentQuoteState,
        quotes: currentQuoteState.quotes.map((quote) =>
          quote.id === currentActiveQuote.id ? updater(quote) : quote,
        ),
      }
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

    commitQuoteState((currentQuoteState) => ({
      quotes: [nextQuote, ...currentQuoteState.quotes],
      selectedQuoteId: nextQuote.id,
    }))
  }

  const duplicateQuote = () => {
    const duplicatedQuote = {
      ...activeQuote,
      id: uuidv4(),
      quoteNumber: `${activeQuote.quoteNumber}-COPY`,
      items: activeQuote.items.map((item) => ({ ...item, id: uuidv4() })),
    }

    commitQuoteState((currentQuoteState) => ({
      quotes: [duplicatedQuote, ...currentQuoteState.quotes],
      selectedQuoteId: duplicatedQuote.id,
    }))
  }

  const deleteQuote = () => {
    if (quoteState.quotes.length === 1) {
      const nextQuote = createQuote()

      commitQuoteState(() => ({
        quotes: [nextQuote],
        selectedQuoteId: nextQuote.id,
      }))
      return
    }

    const fallbackQuoteId =
      quoteState.quotes.find((quote) => quote.id !== activeQuote.id)?.id ?? null

    commitQuoteState((currentQuoteState) => ({
      quotes: currentQuoteState.quotes.filter(
        (quote) => quote.id !== activeQuote.id,
      ),
      selectedQuoteId: fallbackQuoteId,
    }))
  }

  return {
    quotes: quoteState.quotes,
    selectedQuoteId: quoteState.selectedQuoteId,
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
