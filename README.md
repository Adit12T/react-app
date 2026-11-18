# Counter Board

[![CI](https://github.com/Adit12T/react-app/actions/workflows/ci.yml/badge.svg)](https://github.com/Adit12T/react-app/actions/workflows/ci.yml)
[![CodeQL](https://github.com/Adit12T/react-app/actions/workflows/codeql.yml/badge.svg)](https://github.com/Adit12T/react-app/actions/workflows/codeql.yml)

A small habit and tally tracker: named counters, each with its own step, live totals, undo, and state
that survives a page reload. Built with **React 19, TypeScript and Vite**, tested with **Vitest and
Testing Library**.

This started in 2018 as my first React exercise, a list of counters on React 16 with class
components. Version 2 rewrites it with hooks and TypeScript and adds the features below.

**Live demo:** https://adit12t.github.io/demos/react-app/

## Features

- **Named counters with custom steps:** count coffees by 1 and push-ups by 10.
- **Increment, decrement, reset one or reset all**, with values kept between −1,000,000 and 1,000,000.
- **Live totals:** how many counters are active and the sum of all values, announced to screen readers.
- **Undo delete:** a deleted counter can be put back in its original position.
- **Saved automatically** in the browser's local storage; malformed or tampered saved data is ignored safely.
- **Accessible:** every button has a descriptive label, keyboard focus is visible, and the layout works on phones.

## How it is built

- All state changes go through one pure reducer (`src/counters.ts`), so every rule is unit-tested
  without rendering anything.
- Components are small and typed; the form validates input before it reaches the reducer.
- No UI library: the styling is about 80 lines of CSS.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 9 tests: reducer rules, storage, and full user flows
npm run build
```

## License

Copyright © 2026 Aditya Tripathi. All rights reserved. The code is published for viewing only; see
[LICENSE](LICENSE). Security reports: see [SECURITY.md](SECURITY.md).
