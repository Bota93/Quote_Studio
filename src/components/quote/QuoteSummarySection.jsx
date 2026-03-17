import { toInputValue } from '../../utils/quoteFormatters'
import { inputClassName, sectionClassName } from './styles'

function QuoteSummarySection({ quote, onUpdateField }) {
  return (
    <div className={`${sectionClassName} grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]`}>
      <label className="block text-sm font-medium text-slate-700">
        IVA %
        <input
          type="number"
          min="0"
          step="0.01"
          className={inputClassName}
          value={toInputValue(quote.taxRate)}
          onChange={(event) => onUpdateField('taxRate', event.target.value)}
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Notas / condiciones
        <textarea
          rows="4"
          className={inputClassName}
          value={quote.notes}
          onChange={(event) => onUpdateField('notes', event.target.value)}
        />
      </label>
    </div>
  )
}

export default QuoteSummarySection
