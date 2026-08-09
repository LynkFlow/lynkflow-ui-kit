# @lynkflow/ui-kit

Shared React component library for every LynkFlow microfrontend. Visual building blocks only — no application or domain business logic. See the workspace root `CLAUDE.md` and `.claude/rules/ui-kit.md` for the full architecture and conventions this package follows.

## Installation

This package is private, published to GitHub Packages under the `@lynkflow` scope. Consuming repos need a `.npmrc` with:

```ini
@lynkflow:registry=https://npm.pkg.github.com
```

Then:

```bash
npm install @lynkflow/ui-kit
```

`react` and `react-dom` (`^19.0.0`) are peer dependencies — the consuming app provides them (they're shared Module Federation singletons across the platform, see `.claude/rules/architecture.md`).

## Usage

Import the compiled stylesheet **once** in your app (typically in the Shell), then import components as usual:

```tsx
import "@lynkflow/ui-kit/styles.css";
import { Button } from "@lynkflow/ui-kit";

function Example() {
  return (
    <Button variant="primary" size="md">
      Save
    </Button>
  );
}
```

## Styling

Components are styled with [Tailwind CSS v4](https://tailwindcss.com). Design tokens (`color`, `spacing`, `radius`, `typography`) live in `src/tokens/index.ts` — that file is the single source of truth; `tailwind.config.ts` imports it directly rather than duplicating values, so the token file and the generated Tailwind theme can never drift apart.

The raw token values are also exported for any non-Tailwind use case:

```tsx
import { color, spacing, radius, typography, tokens } from "@lynkflow/ui-kit";
```

## Development

Requires Node **22.22.1+** (see `.nvmrc`).

```bash
npm install
npm run typecheck   # tsc --noEmit
npm run test        # Jest + Testing Library
npm run test:coverage
npm run build       # JS (tsup) + types (tsc) + CSS (Tailwind CLI) -> dist/
npm run format       # Prettier --write
npm run format:check
```

A pre-commit hook (Husky + lint-staged) runs Prettier, related tests, and a full type-check on every commit — see `.claude/rules/git-workflow.md` for exactly what runs and why.

### Adding a component

1. `src/components/<Name>/<Name>.tsx` + colocated `<Name>.test.tsx` + `index.ts` (see `Button` as the reference example).
2. Use Tailwind utility classes for styling — extend `tailwind.config.ts`'s theme rather than hardcoding brand values (colors, radius, font family) directly in a component.
3. Prefer logical/RTL-safe utilities (`ps-*`/`pe-*`, `ms-*`/`me-*`, `start-*`/`end-*`) over physical ones (`pl-*`/`pr-*`, `ml-*`/`mr-*`, `left-*`/`right-*`) — the platform must support Arabic (RTL) per the BRD.
4. Include a visible `focus-visible` state on anything interactive.
5. Export the component from `src/index.ts`.
6. See `.claude/rules/testing.md` for what a component's test suite needs to cover.
