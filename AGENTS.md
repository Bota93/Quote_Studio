# AGENTS.md

## Project Context

This repository contains a professional-grade web application intended to demonstrate strong engineering practices.

The goal is not rapid MVP delivery, but to showcase:

- solid frontend architecture
- clean and maintainable code
- adherence to official documentation
- robustness, scalability and reliability

All decisions must prioritize code quality, clarity and correctness over speed.

---

## Core Principles

- Follow best practices from official documentation
- Prefer clarity and maintainability over quick solutions
- Build with long-term scalability in mind
- Ensure predictable and robust behavior
- Avoid hacks and quick fixes
- Code should be production-ready

---

## Development Approach

- Design before implementing
- Use structured and modular architecture
- Separate concerns clearly (UI, logic, data)
- Avoid tightly coupled components
- Refactor when necessary to maintain code quality
- Choose the appropriate local skill before making substantial changes

---

## Tech Stack Guidelines

Primary stack:

- React (functional components)
- Vite
- Tailwind CSS

Standards:

- Follow React official patterns (hooks, composition)
- Avoid anti-patterns (prop drilling without control, excessive state)
- Prefer reusable and composable components
- Keep dependencies justified and minimal

---

## Architecture Guidelines

- Separate presentation and logic layers
- Extract reusable logic into hooks
- Keep components focused and single-responsibility
- Avoid large monolithic components
- Ensure predictable data flow

When complexity increases:

- Introduce structure progressively (hooks, services, utils)
- Avoid premature abstraction, but refactor when patterns repeat

---

## Data Management

- Keep data structures consistent and explicit
- Validate inputs where necessary
- Avoid implicit assumptions in data handling
- Ensure calculations are deterministic and testable

---

## UI / UX Standards

- Professional and clean design
- Consistent spacing and typography
- Clear visual hierarchy
- Avoid visual noise and unnecessary elements
- UI should reflect real-world usage, not demo behavior

---

## Code Quality

- Use clear and descriptive naming
- Avoid deeply nested logic
- Write self-explanatory code
- Prefer readability over cleverness
- Keep functions small and focused

---

## Error Handling

- Anticipate edge cases
- Validate user input where relevant
- Avoid silent failures
- Ensure the UI reflects error states clearly

---

## Security Considerations

Even in frontend-only context:

- Do not trust user input
- Sanitize and validate data when needed
- Avoid exposing sensitive logic unnecessarily
- Prepare code for future backend integration securely

---

## Performance Guidelines

- Avoid unnecessary re-renders
- Use memoization when justified (useMemo, useCallback)
- Keep rendering predictable
- Avoid premature optimization but fix real inefficiencies

---

## Git & Workflow

- Use small, meaningful commits
- Follow commit conventions:

  - feat: new feature
  - fix: bug fix
  - refactor: code improvement
  - style: UI or formatting changes
  - chore: maintenance

- Each commit should represent a logical improvement

---

## AI-assisted Development

AI is used as a support tool, not as a source of truth.

When generating or modifying code:

- Validate against official documentation
- Ensure consistency with project architecture
- Refactor generated code if necessary
- Do not accept solutions that compromise quality

---

## Local Skills Integration

This repository includes local skills under `.agents/skills/`.

These skills are not optional decoration. They are the preferred operating guides for recurring engineering tasks and should be used to keep decisions consistent across the project.

### Available skills

- `frontend-architecture-review`
- `quality-and-hardening`
- `react-refactor-professional`

### How the agent should use them

- Use `frontend-architecture-review` when evaluating or changing component boundaries, folder structure, state ownership, data flow, hooks, services, or overall frontend organization
- Use `quality-and-hardening` when working on validation, edge cases, calculations, persistence safety, error handling, failure states, or frontend security hygiene
- Use `react-refactor-professional` when refactoring React code to improve readability, naming, component size, extraction of hooks or utilities, and maintainability without unnecessary redesign

### Skill selection rule

Before substantial work, the agent should identify whether one of these skills applies.

- If the task is architectural, start from `frontend-architecture-review`
- If the task is about robustness or reliability, start from `quality-and-hardening`
- If the task is mainly a code cleanup or structural refactor, start from `react-refactor-professional`
- If a task spans multiple concerns, combine skills in a deliberate order instead of mixing guidance ad hoc

Preferred order when multiple skills apply:

1. `frontend-architecture-review`
2. `quality-and-hardening`
3. `react-refactor-professional`

This order helps ensure that the target structure is clarified first, robustness requirements are handled second, and code cleanup follows the chosen direction.

---

## Agent Workflow Expectations

For non-trivial changes, the agent should generally follow this workflow:

1. Review the current code and determine whether a local skill applies.
2. Frame the change in terms of architecture, robustness, or refactor goals.
3. Prefer incremental improvements over large rewrites.
4. Keep UI, logic, calculations, and persistence concerns clearly separated.
5. Validate the result with the available project checks when relevant.
6. Update documentation when the operating model, architecture, or developer workflow changes.

The agent should avoid making isolated code edits that solve the immediate symptom while making the structure harder to evolve later.

---

## What to Avoid

- Overengineering without justification
- Quick fixes that reduce maintainability
- Mixing concerns within components
- Unnecessary dependencies
- Code duplication
- Ignoring documentation standards

---

## Expected Behavior from the Agent

The agent should:

- Propose well-structured and maintainable solutions
- Follow official best practices
- Justify architectural decisions when needed
- Keep consistency across the codebase
- Avoid introducing unnecessary complexity
- Use the repository skills as decision support for architecture, hardening, and refactoring work
- Keep documentation aligned when agent workflow or engineering standards change

---

## Long-Term Vision

This project should evolve into:

- a well-structured and scalable frontend application
- a strong portfolio piece demonstrating engineering maturity
- a foundation that could integrate with a robust backend (e.g. Spring Boot)

All current decisions should support future extensibility without compromising current quality.
