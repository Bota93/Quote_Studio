import { getQuoteValidationSummary } from './quoteValidation.js'

export const validateQuoteForExport = (quote) => {
  return getQuoteValidationSummary(quote).exportIssues[0] ?? ''
}
