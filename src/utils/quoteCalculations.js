export const getItemTotal = (item) => {
  const quantity = Number(item.quantity) || 0
  const unitPrice = Number(item.unitPrice) || 0

  return quantity * unitPrice
}

export const getQuoteTotals = (quote) => {
  const subtotal = quote.items.reduce((sum, item) => sum + getItemTotal(item), 0)
  const taxAmount = subtotal * ((Number(quote.taxRate) || 0) / 100)

  return {
    subtotal,
    taxAmount,
    total: subtotal + taxAmount,
  }
}
