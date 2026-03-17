import { inputClassName, sectionClassName } from './styles'

function PartyFormSection({ party, partyKey, title, onUpdatePartyField }) {
  return (
    <div className={sectionClassName}>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
        Identidad
      </p>
      <h2 className="mt-2 font-['Space_Grotesk',_ui-sans-serif,_system-ui] text-2xl font-semibold">
        {title}
      </h2>

      <div className="mt-5 grid gap-4">
        <label className="block text-sm font-medium text-slate-700">
          Nombre o empresa
          <input
            className={inputClassName}
            value={party.name}
            onChange={(event) =>
              onUpdatePartyField(partyKey, 'name', event.target.value)
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          NIF / CIF
          <input
            className={inputClassName}
            value={party.taxId}
            onChange={(event) =>
              onUpdatePartyField(partyKey, 'taxId', event.target.value)
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            className={inputClassName}
            value={party.email}
            onChange={(event) =>
              onUpdatePartyField(partyKey, 'email', event.target.value)
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Telefono
          <input
            className={inputClassName}
            value={party.phone}
            onChange={(event) =>
              onUpdatePartyField(partyKey, 'phone', event.target.value)
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Direccion
          <textarea
            rows="3"
            className={inputClassName}
            value={party.address}
            onChange={(event) =>
              onUpdatePartyField(partyKey, 'address', event.target.value)
            }
          />
        </label>
      </div>
    </div>
  )
}

export default PartyFormSection
