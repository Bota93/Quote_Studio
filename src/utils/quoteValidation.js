const normalizeText = (value, fallback = '') =>
  typeof value === 'string' ? value : fallback

export const hasContent = (value) =>
  typeof value === 'string' && value.trim().length > 0

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

export const isValidEmail = (value) => {
  if (!hasContent(value)) {
    return true
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(String(value).trim())
}

export const isValidPhone = (value) => {
  if (!hasContent(value)) {
    return true
  }

  const sanitizedPhone = String(value).replace(/[\s().-]/gu, '')

  return /^\+?\d{9,15}$/u.test(sanitizedPhone)
}

export const isValidTaxId = (value) => {
  if (!hasContent(value)) {
    return true
  }

  return /^([0-9]{8}[A-Z]|[XYZ][0-9]{7}[A-Z]|[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J])$/iu.test(
    String(value).trim(),
  )
}

export const isValidDateInput = (value) => {
  if (!hasContent(value)) {
    return false
  }

  if (!/^\d{4}-\d{2}-\d{2}$/u.test(String(value))) {
    return false
  }

  const parsedDate = new Date(`${value}T00:00:00`)

  return !Number.isNaN(parsedDate.getTime())
}

const buildPartyErrors = (party, label) => {
  const errors = {}

  if (!hasContent(party?.name)) {
    errors.name = `Completa el nombre de ${label}.`
  }

  if (!isValidTaxId(party?.taxId)) {
    errors.taxId = 'Introduce un NIF, NIE o CIF con un formato valido.'
  }

  if (!isValidEmail(party?.email)) {
    errors.email = 'Introduce un email con un formato valido.'
  }

  if (!isValidPhone(party?.phone)) {
    errors.phone = 'Introduce un telefono valido, con 9 a 15 digitos.'
  }

  return errors
}

export const getQuoteValidationSummary = (quote) => {
  const meta = {}
  const items = {}
  const issuer = buildPartyErrors(quote?.issuer, 'del emisor')
  const client = buildPartyErrors(quote?.client, 'del cliente')

  if (!hasContent(quote?.quoteNumber)) {
    meta.quoteNumber = 'Indica un numero de presupuesto.'
  }

  if (!isValidDateInput(quote?.issueDate)) {
    meta.issueDate = 'Indica una fecha de emision valida.'
  }

  if (hasContent(quote?.validUntil) && !isValidDateInput(quote.validUntil)) {
    meta.validUntil = 'Indica una fecha de validez valida.'
  }

  if (
    isValidDateInput(quote?.issueDate) &&
    isValidDateInput(quote?.validUntil) &&
    quote.validUntil < quote.issueDate
  ) {
    meta.validUntil = 'La fecha de validez no puede ser anterior a la emision.'
  }

  const hasValidLine = Array.isArray(quote?.items)
    ? quote.items.some(
        (item) =>
          hasContent(item?.description) &&
          Number(item?.quantity) > 0 &&
          Number(item?.unitPrice) >= 0,
      )
    : false

  if (!hasValidLine) {
    items.lines =
      'Anade al menos una linea con descripcion, cantidad mayor que cero y precio valido.'
  }

  const exportIssues = [
    meta.quoteNumber,
    meta.issueDate,
    meta.validUntil,
    issuer.name,
    issuer.taxId,
    issuer.email,
    issuer.phone,
    client.name,
    client.taxId,
    client.email,
    client.phone,
    items.lines,
  ].filter(Boolean)

  return {
    meta,
    issuer,
    client,
    items,
    exportIssues,
    hasBlockingIssues: exportIssues.length > 0,
  }
}
