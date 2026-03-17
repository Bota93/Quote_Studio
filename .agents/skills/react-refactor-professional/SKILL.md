---
name: react-refactor-professional
description: Use this skill when refactoring a React codebase to improve readability, maintainability, component boundaries, naming, and alignment with official best practices, while preserving behavior. Do not use for feature ideation or broad architecture redesign unless the refactor directly requires it.
---

# React Refactor Professional

## Goal

Refactor React code into a cleaner, more maintainable, production-quality shape without changing intended behavior.

## When to use

Use this skill when the user wants to:

- split large components
- improve naming and code organization
- reduce duplication
- extract hooks or utilities
- improve readability and maintainability
- make the code look and behave more professionally

## When not to use

Do not use this skill when the request is primarily to:

- add new product features
- redesign the entire architecture from scratch
- optimize prematurely with advanced patterns
- rewrite working code without a concrete benefit

## Refactor principles

- Preserve existing behavior unless a bug is explicitly being fixed
- Keep components small, cohesive, and intention-revealing
- Use naming that reflects domain meaning, not implementation accidents
- Extract repeated logic only when it improves clarity
- Prefer explicitness over cleverness
- Refactor incrementally

## Refactor checklist

### 1. Component health
- Is any component too large or doing too many things?
- Are forms, previews, action bars, and persistence concerns mixed together?
- Can UI sections become independent components without adding confusion?

### 2. Naming quality
- Are names domain-oriented and unambiguous?
- Are generic names like `data`, `info`, `handleChange2`, or `temp` avoided?
- Do file names reflect what the component or utility actually does?

### 3. Repeated logic
- Are calculations repeated in render blocks?
- Are inline event handlers becoming noisy?
- Is there logic that belongs in a dedicated hook or utility?

### 4. State updates
- Are updates explicit and safe?
- Is object nesting handled clearly?
- Are derived values computed in a predictable place?

### 5. Render clarity
- Is JSX readable at a glance?
- Are repeated UI patterns extracted when useful?
- Are sections grouped in a way that mirrors the user experience?

## Expected output

When applying this skill, provide:

1. A concise refactor plan
2. The proposed component and file breakdown
3. Renaming suggestions if needed
4. Specific extraction candidates (hooks, utils, subcomponents)
5. A staged implementation order

## Preferred refactor outcomes

Typical outcomes include:

- page container for orchestration
- presentational subcomponents for UI sections
- `utils/` for deterministic calculations and formatting
- dedicated hook for persistence or document state management
- clearer handler naming and flatter update flows

## Avoid

- refactoring for aesthetics only
- introducing patterns the rest of the project does not need
- turning simple code into indirection-heavy code
- collapsing distinct responsibilities into “generic reusable” abstractions