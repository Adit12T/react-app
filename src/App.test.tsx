import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('Counter Board', () => {
  it('counts, totals and resets', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Increase Push-ups by 10' }))
    await user.click(screen.getByRole('button', { name: 'Increase Coffees by 1' }))

    expect(screen.getByText('2 active')).toBeInTheDocument()
    expect(screen.getByText('Total 11')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reset all' }))
    expect(screen.getByText('0 active')).toBeInTheDocument()
  })

  it('adds a counter with a custom step and rejects bad input', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Add counter' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Give the counter a name.')

    await user.type(screen.getByLabelText('Name'), 'Water')
    await user.clear(screen.getByLabelText('Step'))
    await user.type(screen.getByLabelText('Step'), '3')
    await user.click(screen.getByRole('button', { name: 'Add counter' }))
    await user.click(screen.getByRole('button', { name: 'Increase Water by 3' }))

    expect(screen.getByLabelText('Water: 3')).toBeInTheDocument()
  })

  it('deletes with undo and remembers state across reloads', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)

    await user.click(screen.getByRole('button', { name: 'Increase Coffees by 1' }))
    await user.click(screen.getByRole('button', { name: 'Delete Pages read' }))
    expect(screen.queryByLabelText(/Pages read/)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Undo delete/ }))
    expect(screen.getByLabelText('Pages read: 0')).toBeInTheDocument()

    unmount()
    render(<App />)
    expect(screen.getByLabelText('Coffees: 1')).toBeInTheDocument()
  })
})
