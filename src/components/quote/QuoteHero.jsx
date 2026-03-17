import { formatCurrency } from '../../utils/quoteFormatters'

function QuoteHero({ totals, itemCount }) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-slate-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
      <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.45fr_0.85fr] lg:px-8">
        <div>
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-amber-200">
            Quote Studio
          </span>
          <h1 className="mt-4 font-['Space_Grotesk',_ui-sans-serif,_system-ui] text-4xl font-semibold tracking-[-0.04em] lg:text-6xl">
            Generador de presupuestos profesional para trabajar rapido y bien.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 lg:text-base">
            Crea presupuestos claros, calcula impuestos automaticamente,
            guarda versiones en tu navegador y exporta un PDF listo para enviar
            al cliente.
          </p>
        </div>

        <div className="grid gap-3 rounded-[28px] border border-white/10 bg-white/6 p-4">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
              Total actual
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {formatCurrency(totals.total)}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm text-slate-200">
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Subtotal
              </p>
              <p className="mt-2 font-medium">{formatCurrency(totals.subtotal)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                IVA
              </p>
              <p className="mt-2 font-medium">{formatCurrency(totals.taxAmount)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Lineas
              </p>
              <p className="mt-2 font-medium">{itemCount}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default QuoteHero
