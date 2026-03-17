const normalizeText = (value, fallback = '') =>
  typeof value === 'string' ? value : fallback

const parseNumber = (value) => {
  const parsedValue =
    typeof value === 'number' ? value : Number.parseFloat(String(value))

  return Number.isFinite(parsedValue) ? parsedValue : null
}

export const normalizeOptionalNumberInput = (value, { min = 0 } = {}) => {
  if (value === '') {
    return ''
  }

  const parsedValue = parseNumber(value)

  if (parsedValue === null) {
    return ''
  }

  return Math.max(min, parsedValue)
}

export const normalizeStoredNumber = (value, fallback = 0, { min = 0 } = {}) => {
  const parsedValue = parseNumber(value)

  if (parsedValue === null) {
    return fallback
  }

  return Math.max(min, parsedValue)
}

export const sanitizeParty = (party = {}) => ({
  name: normalizeText(party?.name),
  taxId: normalizeText(party?.taxId),
  email: normalizeText(party?.email),
  phone: normalizeText(party?.phone),
  address: normalizeText(party?.address),
})
