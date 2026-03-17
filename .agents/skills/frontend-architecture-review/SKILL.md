---
name: frontend-architecture-review
description: Use this skill when reviewing or planning the architecture of a React frontend application, especially when the goal is maintainability, modularity, scalability, predictable data flow, and alignment with official documentation. Do not use for quick MVP shortcuts, speculative micro-architectures, or purely visual tweaks.
---

# Frontend Architecture Review

## Goal

Evaluate or propose frontend architecture decisions that improve maintainability, separation of concerns, predictability, and long-term robustness.

## When to use

Use this skill when the user wants to:

- review the current frontend structure
- decide how to split responsibilities across components, hooks, utils, services, and state
- improve maintainability and scalability
- align the codebase with official React guidance
- reduce architectural debt before adding more features

## When not to use

Do not use this skill when the request is mainly about:

- changing colors, spacing, or minor styling
- shipping a quick prototype with minimal structure
- introducing architecture patterns without a concrete need
- backend design or infrastructure decisions

## Principles

- Follow official React patterns and idioms
- Prefer composition over unnecessary abstraction
- Keep a clear separation between UI, state, calculations, and persistence
- Optimize for readability and maintainability
- Avoid coupling unrelated concerns in the same component
- Introduce structure progressively, not dogmatically

## Review checklist

When applying this skill, inspect the project through these lenses:

### 1. Component boundaries
- Are components focused on a single responsibility?
- Are large components mixing rendering, business logic, and persistence?
- Are reusable UI patterns extracted only when they are actually repeated?

### 2. State design
- Is state colocated where possible?
- Is global state avoided unless clearly justified?
- Is the data flow predictable and easy to trace?

### 3. Logic separation
- Are calculations deterministic and extractable into utils or hooks?
- Is persistence logic isolated from presentation logic?
- Is form logic clear and maintainable?

### 4. Folder structure
- Does the current file structure reflect real responsibilities?
- Are files grouped by purpose in a way that helps future changes?
- Is the structure scalable without becoming ceremony-heavy?

### 5. Dependency discipline
- Are dependencies justified?
- Is there a simpler native or existing-project solution?
- Is the project staying aligned with its current scale?

## Expected output

When using this skill, produce:

1. A brief assessment of the current architecture
2. The main issues or risks
3. A proposed target structure
4. Clear, incremental refactor steps
5. Trade-offs when relevant

## Output style

Prefer concrete recommendations such as:

- move calculation logic into `utils/`
- extract persistence into `services/` or a dedicated hook
- split document preview from editing form
- keep shared state in the page-level container

Avoid vague advice such as “improve architecture” without a proposed shape.

## Avoid

- introducing enterprise patterns without need
- creating folders with only one file just for ceremony
- using context, reducers, or state libraries without a concrete pain point
- abstracting everything before the second real use case appears