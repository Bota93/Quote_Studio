---
name: quality-and-hardening
description: Use this skill when improving the robustness of a web application through validation, error handling, safer data handling, edge-case analysis, and general production hardening. Use it especially for applications intended to demonstrate engineering maturity. Do not use for cosmetic design work or speculative security theater.
---

# Quality and Hardening

## Goal

Improve robustness, correctness, and production readiness by addressing validation, failure modes, edge cases, and frontend security hygiene.

## When to use

Use this skill when the user wants to:

- make the system more robust
- identify edge cases
- improve input validation
- strengthen error handling
- prepare the frontend for future backend integration
- demonstrate engineering maturity through safer code

## When not to use

Do not use this skill for:

- purely visual or branding changes
- adding new business features without first stabilizing current behavior
- exaggerated security measures with no relevance to the actual app
- backend-only hardening tasks outside the repo scope

## Principles

- Do not trust input blindly
- Handle invalid or incomplete data explicitly
- Prefer deterministic behavior over implicit fallbacks
- Make failures visible and understandable
- Reduce the chance of inconsistent state
- Prepare interfaces for real-world usage, not happy-path demos only

## Hardening checklist

### 1. Input validation
- Are required fields enforced where relevant?
- Are numeric inputs parsed and constrained safely?
- Are invalid values handled explicitly?
- Are empty, negative, NaN, or malformed values considered?

### 2. Calculation integrity
- Are calculations centralized and testable?
- Are rounding and currency formatting consistent?
- Are totals resilient to partial or invalid line items?

### 3. Persistence safety
- Is localStorage access guarded against malformed stored data?
- Is parsing defensive?
- Is there a fallback strategy when saved data is corrupted?

### 4. UI resilience
- Does the UI communicate invalid states clearly?
- Are destructive actions explicit?
- Can the user recover from mistakes easily?

### 5. Frontend security hygiene
- Is user-provided content rendered safely?
- Are dangerous HTML injection patterns avoided?
- Is the code prepared for secure backend integration later?

### 6. Failure handling
- What happens if export fails?
- What happens if stored data is missing or invalid?
- What happens if required values are incomplete?

## Expected output

When using this skill, return:

1. A risk-focused assessment
2. The most important robustness gaps
3. Concrete hardening changes to implement
4. Validation rules to add
5. Error states and UX safeguards to introduce

## Preferred implementation style

- Centralize validation rules
- Use small helper functions for parsing and normalization
- Add explicit defaults only when safe
- Keep user feedback clear and non-technical
- Prevent invalid state rather than patching it later

## Avoid

- security theater without practical value
- adding complexity that does not reduce real risk
- scattering validation logic across many components
- hiding failures silently