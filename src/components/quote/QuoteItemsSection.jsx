import { getItemTotal } from '../../utils/quoteCalculations'
import { formatCurrency, toInputValue } from '../../utils/quoteFormatters'
import { inputClassName, sectionClassName } from './styles'

function QuoteItemsSection({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}) {
  return (
    <div className={sectionClassName}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Servicios
          </p>
          <h2 className="mt-2 font-['Space_Grotesk',_ui-sans-serif,_system-ui] text-2xl font-semibold">
            Lineas del presupuesto
          </h2>
        </div>
        <button
          type="button"
          onClick={onAddItem}
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Anadir linea
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        {items.map((item, index) => (
          <article
            key={item.id}
            className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-700">
                Linea {index + 1}
              </p>
              <button
                type="button"
                onClick={() => onRemoveItem(item.id)}
                disabled={items.length === 1}
                className="text-sm font-medium text-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Eliminar
              </button>
            </div>

            <div className="mt-4 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[110px_140px_140px] xl:items-end">
              <label className="block text-sm font-medium text-slate-700">
                Cantidad
                <input
                  type="number"
                  min="0"
                  step="1"
                  className={inputClassName}
                  value={toInputValue(item.quantity)}
                  onChange={(event) =>
                    onUpdateItem(item.id, 'quantity', event.target.value)
                  }
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Precio unitario
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClassName}
                  value={toInputValue(item.unitPrice)}
                  onChange={(event) =>
                    onUpdateItem(item.id, 'unitPrice', event.target.value)
                  }
                />
              </label>
              <div className="mt-7 flex min-h-[50px] items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-lg font-semibold text-slate-950">
                  {formatCurrency(getItemTotal(item))}
              </div>
              </div>
              <label className="block text-sm font-medium text-slate-700">
                Descripcion
                <textarea
                  rows="3"
                  className={inputClassName}
                  value={item.description}
                  onChange={(event) =>
                    onUpdateItem(item.id, 'description', event.target.value)
                  }
                />
              </label>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default QuoteItemsSection
