import PartyFormSection from './components/quote/PartyFormSection'
import QuoteHero from './components/quote/QuoteHero'
import QuoteHistorySidebar from './components/quote/QuoteHistorySidebar'
import QuoteItemsSection from './components/quote/QuoteItemsSection'
import QuoteMetaSection from './components/quote/QuoteMetaSection'
import QuotePreview from './components/quote/QuotePreview'
import QuoteSummarySection from './components/quote/QuoteSummarySection'
import { useQuotesState } from './hooks/useQuotesState'
import { exportQuoteToPdf } from './utils/quotePdf'

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
  } = useQuotesState()

  const exportToPdf = () => exportQuoteToPdf(activeQuote, totals)

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

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <section className="grid gap-6">
              <QuoteMetaSection
                quote={activeQuote}
                onUpdateField={updateField}
                onDuplicateQuote={duplicateQuote}
                onDeleteQuote={deleteQuote}
                onExportPdf={exportToPdf}
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

            <QuotePreview quote={activeQuote} totals={totals} />
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
