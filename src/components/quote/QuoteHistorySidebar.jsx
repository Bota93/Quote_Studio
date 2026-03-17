import { getQuoteTotals } from '../../utils/quoteCalculations'
import { formatCurrency } from '../../utils/quoteFormatters'
import { sectionClassName } from './styles'

function QuoteHistorySidebar({
  quotes,
  activeQuoteId,
  onSelectQuote,
  onCreateQuote,
}) {
  return (
    <aside className={`${sectionClassName} h-fit`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Presupuestos
          </p>
          <h2 className="mt-2 font-['Space_Grotesk',_ui-sans-serif,_system-ui] text-2xl font-semibold">
            Historial local
          </h2>
        </div>
        <button
          type="button"
          onClick={onCreateQuote}
          className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Nuevo
        </button>
      </div>

      <div className="mt-5 grid gap-3">
        {quotes.map((quote) => {
          const quoteTotals = getQuoteTotals(quote)
          const isActive = quote.id === activeQuoteId

          return (
            <button
              key={quote.id}
              type="button"
              onClick={() => onSelectQuote(quote.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                isActive
                  ? 'border-slate-950 bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.24)]'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <p className="text-xs uppercase tracking-[0.18em] opacity-70">
                {quote.issueDate || 'Sin fecha'}
              </p>
              <p className="mt-2 font-semibold">{quote.quoteNumber}</p>
              <p className="mt-1 text-sm opacity-80">
                {quote.client.name || 'Cliente pendiente'}
              </p>
              <p className="mt-3 text-sm font-medium">
                {formatCurrency(quoteTotals.total)}
              </p>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

export default QuoteHistorySidebar
