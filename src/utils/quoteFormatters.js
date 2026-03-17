export const formatCurrency = (value) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(value) || 0)

export const toInputValue = (value) => String(value ?? '')

export const buildPartyLines = (party) =>
  [party.name, party.taxId && `NIF/CIF: ${party.taxId}`, party.address, party.email, party.phone].filter(Boolean)
