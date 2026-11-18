export interface Counter {
  id: string
  label: string
  value: number
  step: number
}

export type Action =
  | { type: 'add'; id: string; label: string; step: number }
  | { type: 'increment'; id: string }
  | { type: 'decrement'; id: string }
  | { type: 'reset'; id: string }
  | { type: 'resetAll' }
  | { type: 'remove'; id: string }
  | { type: 'restore'; counter: Counter; index: number }

export const MAX_COUNTERS = 50
export const MIN_VALUE = -1_000_000
export const MAX_VALUE = 1_000_000

const clamp = (value: number) => Math.min(MAX_VALUE, Math.max(MIN_VALUE, value))

/** Pure state transitions, so every rule is unit-testable without rendering anything. */
export function countersReducer(state: Counter[], action: Action): Counter[] {
  switch (action.type) {
    case 'add': {
      const label = action.label.trim()
      if (!label || state.length >= MAX_COUNTERS) return state
      const step = Number.isInteger(action.step) && action.step > 0 ? Math.min(action.step, 1000) : 1
      return [...state, { id: action.id, label: label.slice(0, 40), value: 0, step }]
    }
    case 'increment':
      return state.map((c) => (c.id === action.id ? { ...c, value: clamp(c.value + c.step) } : c))
    case 'decrement':
      return state.map((c) => (c.id === action.id ? { ...c, value: clamp(c.value - c.step) } : c))
    case 'reset':
      return state.map((c) => (c.id === action.id ? { ...c, value: 0 } : c))
    case 'resetAll':
      return state.map((c) => ({ ...c, value: 0 }))
    case 'remove':
      return state.filter((c) => c.id !== action.id)
    case 'restore': {
      if (state.some((c) => c.id === action.counter.id)) return state
      const next = [...state]
      next.splice(Math.min(action.index, next.length), 0, action.counter)
      return next
    }
  }
}

export const initialCounters: Counter[] = [
  { id: 'coffee', label: 'Coffees', value: 0, step: 1 },
  { id: 'pushups', label: 'Push-ups', value: 0, step: 10 },
  { id: 'pages', label: 'Pages read', value: 0, step: 5 },
]

const STORAGE_KEY = 'counter-board:v2'

function isCounter(value: unknown): value is Counter {
  if (typeof value !== 'object' || value === null) return false
  const c = value as Record<string, unknown>
  return typeof c.id === 'string' && typeof c.label === 'string'
    && Number.isFinite(c.value) && Number.isInteger(c.step) && (c.step as number) > 0
}

/** Reads saved counters, ignoring anything malformed (storage is user-editable). */
export function loadCounters(storage: Storage = localStorage): Counter[] {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? 'null')
    if (Array.isArray(parsed) && parsed.every(isCounter)) {
      return parsed.slice(0, MAX_COUNTERS).map((c) => ({ ...c, value: clamp(c.value) }))
    }
  } catch {
    // Corrupt or unavailable storage: fall back to the defaults.
  }
  return initialCounters
}

export function saveCounters(counters: Counter[], storage: Storage = localStorage): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(counters))
  } catch {
    // Storage full or blocked (private mode): the app still works, it just won't persist.
  }
}
