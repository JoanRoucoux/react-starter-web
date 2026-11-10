<img src=".github/assets/banner.png" alt="React Starter Web: ready-to-use React starter" />

[![CI](https://github.com/JoanRoucoux/react-starter-web/actions/workflows/ci.yml/badge.svg)](https://github.com/JoanRoucoux/react-starter-web/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/JoanRoucoux/react-starter-web)](https://github.com/JoanRoucoux/react-starter-web/releases)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Ready-to-use React starter for building a new web application connected to a backend, with every best practice and tool already wired up.

The app ships no global chrome (header, sidebar, navigation): it renders only its body, so it can be embedded in a host shell as-is, or run standalone. No integration mechanism is assumed: it builds, runs and tests on its own either way. It talks to a backend such as [java-starter](https://github.com/JoanRoucoux/java-starter) through a client generated from the backend's OpenAPI contract.

This starter is part of a family: [starter-generator](https://github.com/JoanRoucoux/starter-generator) lists them all and creates an application from any of them.

## Tech stack

| Tool                                                                                                                                                                                   | Role                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| [React](https://react.dev) + [React Compiler](https://react.dev/learn/react-compiler)                                                                                                  | UI library (function components, hooks, auto-memo)     |
| [Vite](https://vite.dev)                                                                                                                                                               | Dev server and production build                        |
| [React Router](https://reactrouter.com)                                                                                                                                                | Routing (data router, loaders as guards, lazy pages)   |
| [TanStack Query](https://tanstack.com/query)                                                                                                                                           | Server state (queries, mutations, cache invalidation)  |
| [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)                                                                                                                | Forms and validation                                   |
| [Tailwind CSS](https://tailwindcss.com)                                                                                                                                                | Utility-first CSS                                      |
| [ESLint](https://eslint.org) + [eslint-react](https://eslint-react.xyz) + [jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)                                             | Lint for TypeScript, React hooks and accessibility     |
| [Prettier](https://prettier.io) + [sort-imports](https://github.com/trivago/prettier-plugin-sort-imports) + [tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) | Code formatting, import ordering and class sorting     |
| [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com/docs/react-testing-library/intro) + [MSW](https://mswjs.io)                                               | Unit tests with mocked HTTP                            |
| [Playwright](https://playwright.dev)                                                                                                                                                   | End-to-end tests                                       |
| [axe](https://github.com/dequelabs/axe-core-npm)                                                                                                                                       | Accessibility audit run inside the e2e suite           |
| [i18next](https://www.i18next.com) + [react-i18next](https://react.i18next.com)                                                                                                        | Internationalization (en/fr, runtime language switch)  |
| [Orval](https://orval.dev)                                                                                                                                                             | Generates models and TanStack Query hooks from OpenAPI |
| [Sheriff](https://sheriff.softarc.io)                                                                                                                                                  | Enforces module boundaries (core/features/shared)      |
| [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/lint-staged/lint-staged)                                                                                  | Git hooks (format + lint on commit)                    |
| [commitlint](https://commitlint.js.org)                                                                                                                                                | Commit message validation (Conventional Commits)       |
| [GitHub Actions](https://github.com/features/actions)                                                                                                                                  | CI: format, lint, tests, build, e2e                    |
| [Docker](https://www.docker.com) + [nginx](https://nginx.org)                                                                                                                          | Production image: multi-stage build served by nginx    |

> [!NOTE]
> The UI component library is not included: plug in the one of your choice.

## Getting started

Generate an application from this starter:

```bash
starter-generator portfolio-web --starter react-web
```

Then run it. Prerequisites: Node (supported versions in `engines` of [package.json](package.json)) and pnpm.

```bash
pnpm install    # installs dependencies and generates the API client (postinstall)
pnpm start      # dev server on http://localhost:4200
```

Calls to `/api` are proxied to `http://localhost:8080` by the dev server (`server.proxy` in [vite.config.ts](vite.config.ts)): adjust the target to your backend.

### Scripts

| Script                   | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| `pnpm start`             | Dev server (with API proxy)                          |
| `pnpm run build`         | Type-check, then production build into `dist/`       |
| `pnpm run build:dev`     | Type-check, then development build into `dist/`      |
| `pnpm run preview`       | Serves the built `dist/` locally                     |
| `pnpm test`              | Unit tests (Vitest)                                  |
| `pnpm run test:coverage` | Unit tests with coverage report and thresholds       |
| `pnpm run e2e`           | End-to-end tests (Playwright)                        |
| `pnpm run e2e:ui`        | E2e tests in interactive mode                        |
| `pnpm run lint`          | Lint (ESLint)                                        |
| `pnpm run lint:fix`      | Lint with automatic fixes                            |
| `pnpm run format`        | Format the whole project (Prettier)                  |
| `pnpm run format:check`  | Check formatting without modifying anything          |
| `pnpm run generate:api`  | Regenerates clients and models from the OpenAPI spec |

## Project structure

Grouped by business domain, not by technical type.

```txt
src/
|-- app/
|   |-- app.tsx                # Layout: page title announcer + <main> + <Outlet />
|   |-- app-root-route.ts      # createAppRoot(): the root route every router is built from
|   |-- app-routes.tsx         # Mounts each feature on its contract segment
|   |-- core/                  # Global, non-business-specific features
|   |   |-- api-client/        # Generated by Orval, do not edit or commit
|   |   |-- http/              # apiFetch (Orval mutator) + ApiError
|   |   |-- i18n/              # i18next config, language switch, namespace loader, page title
|   |   |-- logger/            # Logger + LogLevel (only place allowed to call console)
|   |   |-- query/             # The shared TanStack QueryClient
|   |   |-- session/           # What the current user is allowed to do
|   |   |-- validation/        # The only module allowed to import zod
|   |   `-- not-found-page/    # 404 page
|   |-- features/              # Business features, grouped by domain
|   |   |-- home/              # Single-screen feature
|   |   |   |-- contract/      # home-paths.ts: the only part other modules may import
|   |   |   |-- home-page.tsx  # No screen folder: the page sits at the root
|   |   |   `-- home-routes.tsx # Every feature owns one, even with a single screen
|   |   `-- users/             # Example of a full feature (lazy pages, behind an access guard)
|   |       |-- contract/      # users-paths.ts: USERS_PATHS: segments, links, detail(id)
|   |       |-- list/          # Page + its hook, and delete-dialog/ with its own
|   |       |-- detail/        # Page + hook reading the route parameter
|   |       |-- create/        # Page + hook + its form schema
|   |       |-- users-access-guard.ts   # Called by the route loader: redirects when the session says no
|   |       `-- users-routes.tsx        # Loader, lazy pages, titles; paths come from the contract
|   `-- shared/                # Reusable code
|       `-- testing/           # Test utilities (renderWithProviders, MSW server, test i18n)
|-- environments/              # Per-environment variables (replaced at build time)
`-- styles.css                 # Global styles: Tailwind import + CSS variables
```

Anatomy of a feature: one folder per screen named after its route segment (`list/`, `detail/`, `create/`), plus a `<feature>-routes.tsx` and a `contract/`. A screen folder holds everything that serves only that screen (page, hook, form, dialogs) and **the folder carries the short name while the files carry the full one**: `users/list/user-list-page.tsx`, component `UserListPage`. A single-screen feature keeps its page at the root (`home/home-page.tsx`). The `contract/` folder is the feature's public surface: pure data (route segments, paths, link builders), no component or hook. [app-routes.tsx](src/app/app-routes.tsx) imports a feature's routes file and its contract, nothing else, so a feature moves to another app by moving its folder, and no route path is written as a string outside the feature that owns it.

A page never touches the API client: any I/O lives in a `use-<entity>-<screen>.ts` hook beside it, see [use-user-list.ts](src/app/features/users/list/use-user-list.ts) and [user-list-page.tsx](src/app/features/users/list/user-list-page.tsx). [AGENTS.md](AGENTS.md) holds the complete set of rules: where each kind of file goes, how state is scoped, and the recipe for adding a screen.

Dependency rules, enforced at lint time by [Sheriff](https://sheriff.softarc.io) ([sheriff.config.ts](sheriff.config.ts)): `features` can import `core` and `shared`; `core` can import `shared`; `shared` imports neither `core` nor `features`; features import each other only through `contract/`, `core` may import contracts, and a contract imports nothing from the app; other code shared between features belongs in `core` or `shared`. Modules are barrel-less: import files directly (no `index.ts`), and place files a module wants to keep private in an `internal/` subdirectory.

Available import aliases: `@core/*`, `@features/*`, `@shared/*`, `@environments/*`.

## Talking to the backend

The API contract is described in [openapi/openapi.yaml](openapi/openapi.yaml). TypeScript models and TanStack Query hooks are generated by Orval into `src/app/core/api-client` (gitignored, regenerated on every `pnpm install`). Every call goes through `apiFetch` ([api-fetch.ts](src/app/core/http/api-fetch.ts)), the Orval mutator: it prefixes the API base URL, sets the JSON content type when there is a body, and throws an `ApiError` on a failed call.

To bootstrap a real project:

1. Replace `openapi/openapi.yaml` with your backend's specification (or point `orval.config.ts` at its URL).
2. Run `pnpm run generate:api`.
3. Use the generated hooks in the screen's hook, never in the page. There is no hand-written pass-through layer: the generated client already is the data-access layer, and the tests mock HTTP, not the hooks.

The screen hook owns the data access and the derived state, as in `features/users/list/use-user-list.ts`:

```tsx
export function useUserList(): UserList {
  const [search, setSearch] = useState('');
  const { data, isLoading, isError, refetch } = useGetUsers();
  const users = data ?? NO_USERS;

  const term = search.trim().toLowerCase();
  const filteredUsers = term
    ? users.filter((user) => `${user.firstName} ${user.lastName}`.toLowerCase().includes(term))
    : users;

  return { users, filteredUsers, search, setSearch, isLoading, isError, retry: () => void refetch() };
}
```

The page in `features/users/list/user-list-page.tsx` only calls the hook and renders what it returns:

```tsx
export function UserListPage(): React.JSX.Element {
  const { t } = useTranslation('users');
  const { filteredUsers, search, setSearch, isLoading, isError, retry } = useUserList();

  return <h1 className="text-2xl font-semibold tracking-tight">{t('list.title')}</h1>;
}
```

A mutation lives in its own hook and invalidates the query it makes stale, see [use-user-delete.ts](src/app/features/users/list/delete-dialog/use-user-delete.ts): it returns its outcome and the page decides what follows (navigation included).

Add a hand-written `<feature>-repository.ts` at the feature root only when it earns its place: aggregating several calls into one business operation, mapping DTOs to a view model shared by several pages, or absorbing an API quirk you do not want to spread.

HTTP errors are logged by `apiFetch`; showing a failure is the job of the screen that asked (each hook exposes `isError`), because a toaster raised from the fetch layer would duplicate or replace that message.

Access control follows the same path: [core/session/session-query.ts](src/app/core/session/session-query.ts) asks the backend once what the current user may do, and each feature keeps its own decision in a `<feature>-access-guard.ts` called from the loader of its routes file: see [users-access-guard.ts](src/app/features/users/users-access-guard.ts).

## Internationalization

Translations live in `public/i18n/` (en and fr) and are split in two layers:

- `public/i18n/<lang>.json`: global keys, loaded before the app renders. Keep it minimal: only cross-cutting keys that must resolve synchronously, such as `pageTitle.*` (the page title is translated on navigation, before any feature namespace has loaded) and the 404 page.
- `public/i18n/<feature>/<lang>.json`: one namespace per feature, loaded by the loader of the feature's routes (`loadNamespace('<feature>')`) before the page renders. Keys are read through the namespace:

```tsx
const { t } = useTranslation('users');

return <h1>{t('list.title')}</h1>;
```

The language can be switched at runtime via `setActiveLang()` ([language-store.ts](src/app/core/i18n/language-store.ts)), by the app itself, or by a host shell embedding it, and is persisted in a cookie. Page titles are translated and suffixed automatically by [page-title.tsx](src/app/core/i18n/page-title.tsx), from the `handle.title` key of the matched routes.

## Styling

[Tailwind CSS v4](https://tailwindcss.com) is wired up through its Vite plugin (`@tailwindcss/vite` in [vite.config.ts](vite.config.ts)) and imported once in [src/styles.css](src/styles.css) with `@import 'tailwindcss';`. No `tailwind.config.js` is needed for basic usage (Tailwind v4 is CSS-first); use `@theme` in `styles.css` to customize tokens if needed. Components carry no stylesheet of their own: utilities in the markup and the CSS variables of `styles.css` cover it. The active color scheme follows the OS preference, unless a host shell forces one by setting `data-theme` on `<html>`.

## Environments

`src/environments/environment.ts` holds local development values and is replaced at build time by `environment.production.ts` (the `@environments/environment` alias in [vite.config.ts](vite.config.ts) picks the file from the build mode). Always import `@environments/environment`, never a specific file.

## Deployment

[Dockerfile](Dockerfile) builds the production image in two stages: Node installs the dependencies, generates the API client and builds the app; [nginx](nginx.conf) serves the result on port 80.

```bash
docker build -t my-app .
docker run --rm -p 8080:80 my-app
```

The nginx config does the two things a single-page app needs: unmatched paths fall back to `index.html` so a refresh on `/users/1` still works, and hashed assets are cached for a year while everything else is revalidated. A missing file answers 404, and nginx also sends the security headers (a strict CSP with Trusted Types, `frame-ancestors 'none'`). Calls to `/api` are **not** proxied there, the proxy in [vite.config.ts](vite.config.ts) is a dev-server concern only. In production a host shell or an ingress routes them; add a `location /api` to [nginx.conf](nginx.conf) if the container has to reach the backend itself. The strict CSP forbids embedding the app in an iframe and writing HTML from a UI library: relax `frame-ancestors` and `X-Frame-Options` for an iframe host, and add a named Trusted Types policy for a library.

## Testing

Component tests use [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) (`render`, `screen`, `userEvent`) through `renderWithProviders` ([render-with-providers.tsx](src/app/shared/testing/render-with-providers.tsx)): querying by role or label asserts accessibility for free and matches the Playwright `getByRole` style used in e2e. HTTP is mocked with [MSW](https://mswjs.io) ([msw-server.ts](src/app/shared/testing/msw-server.ts)), and an unhandled request fails the test. Screen hooks, the fetch layer and form schemas are tested without rendering a page. The [jest-dom](https://github.com/testing-library/jest-dom) matchers (`toBeInTheDocument`, `toBeEnabled`, ...) are registered in [src/test-setup.ts](src/test-setup.ts).

E2e tests live in `e2e/` (`pages/` for page objects, `fixtures/` for custom test fixtures), next to the app rather than in a separate package. They also run [axe](https://github.com/dequelabs/axe-core-npm) on the rendered page through `expectNoAccessibilityViolations`, which fails on any WCAG 2.1 A/AA violation (call it again once a dialog is open, since axe only sees what is currently rendered).

Coverage counts **every** source file, not only the ones a spec imports: `coverage.include` in [vite.config.ts](vite.config.ts) is what makes an untested file report as uncovered instead of disappearing from the report. `coverage.exclude` holds the generated client and the pure wiring (bootstrap, `*-routes.tsx`, environments, test helpers).

## Quality and conventions

- **On commit**: lint-staged formats and lints the staged files; commitlint enforces [Conventional Commits](https://www.conventionalcommits.org) (`feat: ...`, `fix: ...`, ...).
- **In CI** ([.github/workflows/ci.yml](.github/workflows/ci.yml)): format check, lint, unit tests, build and e2e on every push/PR, with the required check `ci` as the gate job that waits for all the others (the e2e, `docker` and `ops` jobs included). A separate workflow, [generator-check.yml](.github/workflows/generator-check.yml), scaffolds an app from the working tree and runs its own gates, so the generator manifest and templates cannot drift (maintainer notes in [.generator/README.md](.generator/README.md)).
- **Code conventions**: function components and hooks, named exports, one `use-<entity>-<screen>.ts` hook per screen, pages suffixed with `-page`, and the React Compiler doing the memoization. The full list lives in [AGENTS.md](AGENTS.md).
- **Config files** use ESM `.mjs` where the tool supports it: [eslint.config.mjs](eslint.config.mjs), [prettier.config.mjs](prettier.config.mjs), [commitlint.config.mjs](commitlint.config.mjs).

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for the contribution workflow and [CODE_OF_CONDUCT.md](.github/CODE_OF_CONDUCT.md) for community guidelines. To report a vulnerability, see [SECURITY.md](.github/SECURITY.md).

## License

This project is licensed under [MIT](LICENSE).
