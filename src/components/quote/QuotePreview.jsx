import { getItemTotal } from '../../utils/quoteCalculations'
import { buildPartyLines, formatCurrency } from '../../utils/quoteFormatters'
import { sectionClassName } from './styles'

function QuotePreview({ quote, totals }) {
  const clientLines = buildPartyLines(quote.client)

  return (
    <aside
      className={`${sectionClassName} h-fit w-full min-w-0 xl:sticky xl:top-6 xl:justify-self-end xl:self-start`}
    >
      <div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Vista previa
          </p>
          <h2 className="mt-2 font-['Space_Grotesk',_ui-sans-serif,_system-ui] text-2xl font-semibold">
            Presupuesto visual
          </h2>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.1)]">
        <div className="bg-slate-950 px-6 py-6 text-white">
          <p className="text-xs uppercase tracking-[0.22em] text-amber-200">
            Documento
          </p>
          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-['Space_Grotesk',_ui-sans-serif,_system-ui] text-3xl font-semibold">
                Presupuesto
              </h3>
              <p className="mt-2 text-sm text-slate-300">{quote.quoteNumber}</p>
            </div>
            <div className="text-right text-xs text-slate-300">
              <p>Fecha: {quote.issueDate || '-'}</p>
              <p className="mt-2">Valido hasta: {quote.validUntil || '-'}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Emisor
              </p>
              <div className="mt-3 space-y-1 text-sm text-slate-600">
                {buildPartyLines(quote.issuer).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Cliente
              </p>
              <div className="mt-3 space-y-1 text-sm text-slate-600">
                {clientLines.length > 0 ? (
                  clientLines.map((line) => <p key={line}>{line}</p>)
                ) : (
                  <p>Pendiente de completar</p>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Concepto</th>
                  <th className="px-4 py-3 font-medium">Cant.</th>
                  <th className="px-4 py-3 font-medium">Precio</th>
                  <th className="px-4 py-3 font-medium">Importe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {quote.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-4 text-slate-700">
                      {item.description || 'Servicio sin descripcion'}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {item.quantity || 0}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-950">
                      {formatCurrency(getItemTotal(item))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ml-auto grid w-full max-w-xs gap-3 rounded-2xl bg-slate-50 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium text-slate-900">
                {formatCurrency(totals.subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">IVA ({quote.taxRate || 0}%)</span>
              <span className="font-medium text-slate-900">
                {formatCurrency(totals.taxAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="font-semibold text-slate-950">
                {formatCurrency(totals.total)}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600">
            <p className="font-medium text-slate-900">Notas</p>
            <p className="mt-2 whitespace-pre-line">
              {quote.notes || 'Sin observaciones adicionales.'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default QuotePreview
