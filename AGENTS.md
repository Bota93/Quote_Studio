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

---

## Long-Term Vision

This project should evolve into:

- a well-structured and scalable frontend application
- a strong portfolio piece demonstrating engineering maturity
- a foundation that could integrate with a robust backend (e.g. Spring Boot)

All current decisions should support future extensibility without compromising current quality.