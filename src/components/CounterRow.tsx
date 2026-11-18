import type { Counter } from '../counters'

interface Props {
  counter: Counter
  onIncrement: () => void
  onDecrement: () => void
  onReset: () => void
  onRemove: () => void
}

export function CounterRow({ counter, onIncrement, onDecrement, onReset, onRemove }: Props) {
  const { label, value, step } = counter
  return (
    <li className="counter">
      <span className={value === 0 ? 'badge badge--zero' : 'badge'} aria-label={`${label}: ${value}`}>
        {value === 0 ? 'Zero' : value.toLocaleString()}
      </span>
      <span className="counter__label">
        {label} <small>step {step}</small>
      </span>
      <div className="counter__actions">
        <button type="button" onClick={onDecrement} aria-label={`Decrease ${label} by ${step}`}>−</button>
        <button type="button" onClick={onIncrement} aria-label={`Increase ${label} by ${step}`}>+</button>
        <button type="button" onClick={onReset} aria-label={`Reset ${label}`} disabled={value === 0}>Reset</button>
        <button type="button" className="danger" onClick={onRemove} aria-label={`Delete ${label}`}>Delete</button>
      </div>
    </li>
  )
}
