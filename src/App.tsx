import { useEffect, useReducer, useState } from 'react'
import { AddCounterForm } from './components/AddCounterForm'
import { CounterRow } from './components/CounterRow'
import { MAX_COUNTERS, countersReducer, loadCounters, saveCounters, type Counter } from './counters'

interface Removed {
  counter: Counter
  index: number
}

export default function App() {
  const [counters, dispatch] = useReducer(countersReducer, undefined, () => loadCounters())
  const [removed, setRemoved] = useState<Removed | null>(null)

  useEffect(() => saveCounters(counters), [counters])

  const active = counters.filter((c) => c.value !== 0).length
  const total = counters.reduce((sum, c) => sum + c.value, 0)

  function remove(counter: Counter) {
    setRemoved({ counter, index: counters.indexOf(counter) })
    dispatch({ type: 'remove', id: counter.id })
  }

  return (
    <>
      <header className="navbar">
        <h1>Counter Board</h1>
        <p aria-live="polite">
          <span className="pill" title="Counters above or below zero">{active} active</span>
          <span className="pill">Total {total.toLocaleString()}</span>
        </p>
      </header>

      <main className="container">
        <AddCounterForm
          disabled={counters.length >= MAX_COUNTERS}
          onAdd={(label, step) => dispatch({ type: 'add', id: crypto.randomUUID(), label, step })}
        />

        <div className="toolbar">
          <button type="button" onClick={() => dispatch({ type: 'resetAll' })} disabled={active === 0}>
            Reset all
          </button>
          {removed && (
            <button
              type="button"
              onClick={() => {
                dispatch({ type: 'restore', counter: removed.counter, index: removed.index })
                setRemoved(null)
              }}
            >
              Undo delete of “{removed.counter.label}”
            </button>
          )}
        </div>

        {counters.length === 0 ? (
          <p className="empty">No counters yet. Add one above.</p>
        ) : (
          <ul className="counters" aria-label="Counters">
            {counters.map((counter) => (
              <CounterRow
                key={counter.id}
                counter={counter}
                onIncrement={() => dispatch({ type: 'increment', id: counter.id })}
                onDecrement={() => dispatch({ type: 'decrement', id: counter.id })}
                onReset={() => dispatch({ type: 'reset', id: counter.id })}
                onRemove={() => remove(counter)}
              />
            ))}
          </ul>
        )}
      </main>
    </>
  )
}
