import { inputClassName, sectionClassName } from './styles'

function QuoteMetaSection({
  quote,
  onUpdateField,
  onDuplicateQuote,
  onDeleteQuote,
  onExportPdf,
  exportError,
  isExportingPdf,
  storageError,
  validationSummary,
}) {
  const canExport = !validationSummary.hasBlockingIssues

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
            disabled={isExportingPdf || !canExport}
            className="rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isExportingPdf ? 'Exportando...' : 'Exportar PDF'}
          </button>
        </div>
      </div>

      {(storageError || exportError) && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {storageError || exportError}
        </div>
      )}

      {!canExport && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <p className="font-medium text-slate-900">Antes de exportar</p>
          <ul className="mt-2 grid gap-1">
            {validationSummary.exportIssues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Numero
          <input
            className={inputClassName}
            value={quote.quoteNumber}
            onChange={(event) => onUpdateField('quoteNumber', event.target.value)}
          />
          {validationSummary.meta.quoteNumber && (
            <p className="mt-2 text-xs text-rose-700">
              {validationSummary.meta.quoteNumber}
            </p>
          )}
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Fecha de emision
          <input
            type="date"
            className={inputClassName}
            value={quote.issueDate}
            onChange={(event) => onUpdateField('issueDate', event.target.value)}
          />
          {validationSummary.meta.issueDate && (
            <p className="mt-2 text-xs text-rose-700">
              {validationSummary.meta.issueDate}
            </p>
          )}
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Valido hasta
          <input
            type="date"
            className={inputClassName}
            value={quote.validUntil}
            onChange={(event) => onUpdateField('validUntil', event.target.value)}
          />
          {validationSummary.meta.validUntil && (
            <p className="mt-2 text-xs text-rose-700">
              {validationSummary.meta.validUntil}
            </p>
          )}
        </label>
      </div>
    </div>
  )
}

export default QuoteMetaSection
