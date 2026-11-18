import { useState, type FormEvent } from 'react'

interface Props {
  onAdd: (label: string, step: number) => void
  disabled: boolean
}

export function AddCounterForm({ onAdd, disabled }: Props) {
  const [label, setLabel] = useState('')
  const [step, setStep] = useState('1')
  const [error, setError] = useState<string | null>(null)

  function submit(event: FormEvent) {
    event.preventDefault()
    const stepNumber = Number(step)
    if (!label.trim()) return setError('Give the counter a name.')
    if (!Number.isInteger(stepNumber) || stepNumber < 1 || stepNumber > 1000) {
      return setError('Step must be a whole number from 1 to 1000.')
    }
    onAdd(label, stepNumber)
    setLabel('')
    setStep('1')
    setError(null)
  }

  return (
    <form className="add-form" onSubmit={submit} noValidate>
      <label>
        Name
        <input value={label} maxLength={40} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Glasses of water" />
      </label>
      <label>
        Step
        <input type="number" min={1} max={1000} value={step} onChange={(e) => setStep(e.target.value)} />
      </label>
      <button type="submit" disabled={disabled}>Add counter</button>
      {error && <p role="alert" className="error">{error}</p>}
    </form>
  )
}
