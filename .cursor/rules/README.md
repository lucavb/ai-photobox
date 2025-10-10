# Cursor Rules for AI PhotoBox

This directory contains Cursor rules that guide AI-assisted development for the PhotoBox application. These rules ensure consistent code quality, architecture decisions, and best practices throughout the project.

## Rule Files Overview

### 1. `project-guidelines.mdc` (Always Applied)
**Core project rules that apply to all files**
- Project overview and current development stage
- Technical stack (Next.js 15, TypeScript, shadcn/ui, Tailwind CSS v4)
- Core architecture principles and technology constraints
- Code quality standards (KISS, DRY, SOLID)
- Component structure and separation of concerns
- Environment configuration basics
- Working style guidelines

**When to reference:** Understanding overall project structure, constraints, and development approach

### 2. `typescript-react.mdc` (Applied to *.ts, *.tsx)
**TypeScript and React-specific guidelines**
- TypeScript strict type safety standards
- React 19 best practices (functional components, hooks)
- Hooks usage patterns (useCallback, useMemo)
- Error boundaries
- State management principles
- Next.js 15 App Router (Server vs Client Components)
- API routes best practices

**When to reference:** Writing or modifying TypeScript/React components

### 3. `api-integration.mdc` (Manual)
**Comprehensive API service layer and integration guidelines**
- API service layer architecture and separation of concerns
- Complete TNG Image API endpoint documentation
- Authentication with Bearer tokens
- Request/response formats (multipart/form-data)
- Detailed error handling implementation
- Timeout and retry logic
- Image optimization before upload

**When to reference:** Implementing or debugging API calls, handling errors

### 4. `ui-components.mdc` (Manual)
**UI/UX design and component patterns**
- Design principles (modern, clean, minimal)
- User experience guidelines (feedback, states, animations)
- shadcn/ui component usage patterns
- Camera component guidelines (access flow, best practices)
- Layout and style selection interface
- Mobile considerations (touch targets, responsive design)

**When to reference:** Building UI components, designing user interfaces, implementing camera features

## Current Rule Files

```
.cursor/rules/
├── project-guidelines.mdc    (Always Applied - all files)
├── typescript-react.mdc      (Auto-applied to *.ts, *.tsx)
├── api-integration.mdc       (Manual - by description)
├── ui-components.mdc         (Manual - by description)
└── README.md                 (Documentation)
```

---

**Note:** These rules are living documents. Update them as the project evolves to maintain code quality and consistency.

