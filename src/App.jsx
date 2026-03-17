import { useState } from 'react'
import PartyFormSection from './components/quote/PartyFormSection'
import QuoteHero from './components/quote/QuoteHero'
import QuoteHistorySidebar from './components/quote/QuoteHistorySidebar'
import QuoteItemsSection from './components/quote/QuoteItemsSection'
import QuoteMetaSection from './components/quote/QuoteMetaSection'
import QuotePreview from './components/quote/QuotePreview'
import QuoteSummarySection from './components/quote/QuoteSummarySection'
import { useQuotesState } from './hooks/useQuotesState'
import { exportQuoteToPdf } from './utils/quotePdf'

const previewColumnClassNameBySize = {
  compact: 'minmax(280px,340px)',
  default: 'minmax(320px,396px)',
  expanded: 'minmax(360px,460px)',
}

function App() {
  const {
    quotes,
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
  } = useQuotesState()
  const [exportError, setExportError] = useState('')
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [previewSize, setPreviewSize] = useState('default')

  const exportToPdf = async () => {
    setIsExportingPdf(true)
    setExportError('')

    try {
      await exportQuoteToPdf(activeQuote, totals)
    } catch {
      setExportError(
        'No se pudo exportar el PDF. Revisa los datos del presupuesto e intentalo de nuevo.',
      )
    } finally {
      setIsExportingPdf(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.28),_transparent_24%),linear-gradient(180deg,_#fffdf7_0%,_#f8fafc_48%,_#eef2ff_100%)] text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6">
        <QuoteHero totals={totals} itemCount={activeQuote.items.length} />

        <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <QuoteHistorySidebar
            quotes={quotes}
            activeQuoteId={activeQuote.id}
            onSelectQuote={setSelectedQuoteId}
            onCreateQuote={createNewQuote}
          />

          <div
            className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_var(--preview-column-size)]"
            style={{
              '--preview-column-size': previewColumnClassNameBySize[previewSize],
            }}
          >
            <section className="grid gap-6">
              <QuoteMetaSection
                quote={activeQuote}
                onUpdateField={updateField}
                onDuplicateQuote={duplicateQuote}
                onDeleteQuote={deleteQuote}
                onExportPdf={exportToPdf}
                exportError={exportError}
                isExportingPdf={isExportingPdf}
                storageError={storageError}
              />

              <div className="grid gap-6 lg:grid-cols-2">
                {[
                  ['issuer', 'Datos del emisor'],
                  ['client', 'Datos del cliente'],
                ].map(([partyKey, title]) => (
                  <PartyFormSection
                    key={partyKey}
                    party={activeQuote[partyKey]}
                    partyKey={partyKey}
                    title={title}
                    onUpdatePartyField={updatePartyField}
                  />
                ))}
              </div>

              <QuoteItemsSection
                items={activeQuote.items}
                onAddItem={addItem}
                onRemoveItem={removeItem}
                onUpdateItem={updateItem}
              />

              <QuoteSummarySection
                quote={activeQuote}
                onUpdateField={updateField}
              />
            </section>

            <QuotePreview
              quote={activeQuote}
              totals={totals}
              previewSize={previewSize}
              onPreviewSizeChange={setPreviewSize}
            />
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
