import { inputClassName, sectionClassName } from './styles'

function QuoteMetaSection({
  quote,
  onUpdateField,
  onDuplicateQuote,
  onDeleteQuote,
  onExportPdf,
}) {
  return (
    <div className={sectionClassName}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Configuracion
          </p>
          <h2 className="mt-2 font-['Space_Grotesk',_ui-sans-serif,_system-ui] text-2xl font-semibold">
            Datos principales
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onDuplicateQuote}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Duplicar
          </button>
          <button
            type="button"
            onClick={onDeleteQuote}
            className="rounded-2xl border border-rose-200 px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
          >
            Eliminar
          </button>
          <button
            type="button"
            onClick={onExportPdf}
            className="rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Numero
          <input
            className={inputClassName}
            value={quote.quoteNumber}
            onChange={(event) => onUpdateField('quoteNumber', event.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Fecha de emision
          <input
            type="date"
            className={inputClassName}
            value={quote.issueDate}
            onChange={(event) => onUpdateField('issueDate', event.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Valido hasta
          <input
            type="date"
            className={inputClassName}
            value={quote.validUntil}
            onChange={(event) => onUpdateField('validUntil', event.target.value)}
          />
        </label>
      </div>
    </div>
  )
}

export default QuoteMetaSection
