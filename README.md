# Custom Router

A minimal, educational router implementation for React — built from scratch using **Zustand** and the native **History API**.

> "You don't truly understand a tool until you've built it yourself."

## Philosophy

This project isn't meant to replace React Router. It exists to **demystify** how client-side routing works under the hood.

Every feature is added incrementally, with extensive documentation, so the learning curve remains flat and deliberate.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [React](https://react.dev) | UI Library |
| [Zustand](https://zustand.docs.pmnd.rs) | State management (replaces React Context) |
| [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) | Browser navigation (`pushState`, `popstate`) |
| [TypeScript](https://www.typescriptlang.org) | Type Safety |
| [Vite](https://vitejs.dev) | Build Tool |

---

## Architecture (v0.1.0)

### Three-Layer Design

```
┌─────────────────────────────────────────────────────┐
│                    React App                        │
│  ┌─────────────┐  ┌──────────────┐                 │
│  │   <Link>    │  │  navigate()  │                 │
│  │  Component  │  │  (global)    │                 │
│  └──────┬──────┘  └──────┬───────┘                 │
│         │                │                          │
│         └────────┬───────┘                          │
│                  │                                  │
│         ┌────────▼────────┐                         │
│         │   Zustand Store │  ← Single source of truth│
│         │  { pathname }   │                         │
│         └────────┬────────┘                         │
│                  │                                  │
├──────────────────┼──────────────────────────────────┤
│         ┌────────▼────────┐                         │
│         │  History API    │  ← Browser integration  │
│         │  pushState()    │                         │
│         │  popstate event │                         │
│         └─────────────────┘                         │
└─────────────────────────────────────────────────────┘
```

### Data Flow

```
User clicks <Link to="/about">
  → e.preventDefault()           [stop full page reload]
  → navigate('/about')           [update store]
  → pushState(null, '', '/about') [update browser URL]
  → set({ pathname: '/about' })  [trigger React re-render]
  → Component tree updates       [new page renders]
```

### Browser Back/Forward

```
User clicks browser back button
  → window dispatches 'popstate' event
  → listener updates store
  → React re-renders with new pathname
```

---

## File Structure

```
src/
├── store/
│   └── router.store.ts     # Zustand store — the brain
├── router/
│   ├── core/
│   │   ├── Link.tsx        # <Link> component — the UI
│   │   └── navigate.ts     # global navigate() — programmatic API
│   └── index.ts            # public API exports
├── pages/                  # Pages
├── components/             # AppLayout
├── App.tsx                 # usage example
└── main.tsx                # entry point
```

---

## Core Files — Annotated

### `store/router.store.ts`

The **single source of truth** for the entire routing system.

```typescript
import { create } from 'zustand'

interface RouteState {
  pathname: string              // current URL path
  navigate: (to: string) => void // function to change routes
}

export const useRouterStore = create<RouteState>((set, get) => ({
  pathname: window.location.pathname,  // initialize from browser

  navigate: (to: string) => {
    window.history.pushState(null, '', to)  // update browser URL
    set({ ...get(), pathname: to })         // trigger React re-render
  },
}))

// Listen for browser back/forward buttons
window.addEventListener('popstate', () => {
  const currentState = useRouterStore.getState()
  useRouterStore.setState({ ...currentState, pathname: window.location.pathname })
})
```

**Key Concepts:**
- `pushState` changes the URL **without** reloading the page
- `popstate` fires when the user presses back/forward
- Zustand's `set()` triggers React re-renders for all subscribed components

---

### `router/core/Link.tsx`

The `<Link>` component — our replacement for `<a>` tags.

```typescript
export function Link({ to, children }: LinkProps) {
  const navigate = useRouterStore((s) => s.navigate)  // ← selector

  return (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault()     // stop the browser from navigating
        navigate(to)           // let our router handle it
      }}
    >
      {children}
    </a>
  )
}
```

**Key Concepts:**
- `e.preventDefault()` — critical! Prevents full-page reload
- `navigate(to)` — delegates to the store, which updates state + history
- Selector `(s) => s.navigate` — component only re-renders if `navigate` changes (it never does)

---

### `router/core/navigate.ts`

Programmatic navigation — useful for redirects, form submissions, etc.

```typescript
import { useRouterStore } from "@/store/router.store"

export function navigate(to: string) {
  useRouterStore.getState().navigate(to)
}
```

**Key Concept:**
- `getState()` reads Zustand state **outside** React components
- This means you can navigate from anywhere — event handlers, fetch responses, even tests

---

## Usage Example

```tsx
import { useRouterStore } from './store/router.store'
import { Link } from './router/core/Link'

function App() {
  const pathname = useRouterStore(s => s.pathname)

  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      <main>
        {pathname === '/' && <h1>Home Page</h1>}
        {pathname === '/about' && <h1>About Page</h1>}
      </main>
    </div>
  )
}
```

**No Provider needed.** Just import and use.

---

## Development Roadmap

| Version | Feature | Complexity |
|---------|---------|------------|
| **v0.1.0** | Zustand store + Link + navigate + popstate | ★☆☆☆☆ |
| v0.2.0 | Route matching (exact paths) | ★★☆☆☆ |
| v0.3.0 | Path parameters (`/users/:id`) | ★★★☆☆ |
| v0.4.0 | `useParams()` hook | ★★★☆☆ |
| v0.5.0 | Nested routes + `<Outlet>` | ★★★★☆ |
| v0.6.0 | Route guards (protected routes) | ★★★★☆ |
| v0.7.0 | Query string parsing | ★★★☆☆ |
| v0.8.0 | `replaceState` vs `pushState` | ★★☆☆☆ |
| v1.0.0 | Full feature parity with react-router concepts | ★★★★★ |

---

## Learning Goals

This project is built to deeply understand:

1. **History API** — pushState, replaceState, popstate
2. **State Management** — Zustand as a global store, selectors, subscriptions
3. **React Patterns** — component composition, hooks, preventing re-renders
4. **URL Matching** — regex patterns, parameter extraction
5. **React Router Internals** — enough to read source code and contribute

---

## Getting Started

```bash
git clone https://github.com/Mehrdadnka/custom-router.git
cd custom-router
npm install
npm run dev
```

---

## License

MIT — because learning should be free.

---

## Credits

Inspired by:
- [React Router](https://reactrouter.com)
- [TanStack Router](https://tanstack.com/router)
- Countless "build your own router" blog posts

Built by [@Mehrdadnka](https://github.com/Mehrdadnka)
