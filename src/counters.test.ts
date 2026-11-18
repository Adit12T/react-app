import { describe, expect, it } from 'vitest'
import { MAX_COUNTERS, MAX_VALUE, countersReducer, loadCounters, saveCounters, type Counter } from './counters'

const c = (id: string, value = 0, step = 1): Counter => ({ id, label: id, value, step })

describe('countersReducer', () => {
  it('increments and decrements by each counter’s own step', () => {
    let state = [c('a', 0, 5), c('b')]
    state = countersReducer(state, { type: 'increment', id: 'a' })
    state = countersReducer(state, { type: 'decrement', id: 'b' })
    expect(state.map((x) => x.value)).toEqual([5, -1])
  })

  it('does not mutate the previous state', () => {
    const before = [c('a')]
    countersReducer(before, { type: 'increment', id: 'a' })
    expect(before[0].value).toBe(0)
  })

  it('validates new counters', () => {
    expect(countersReducer([], { type: 'add', id: '1', label: '   ', step: 1 })).toEqual([])
    expect(countersReducer([], { type: 'add', id: '1', label: 'x', step: -3 })[0].step).toBe(1)
    const full = Array.from({ length: MAX_COUNTERS }, (_, i) => c(String(i)))
    expect(countersReducer(full, { type: 'add', id: 'new', label: 'one more', step: 1 })).toHaveLength(MAX_COUNTERS)
  })

  it('clamps at the maximum value', () => {
    const state = countersReducer([c('a', MAX_VALUE, 10)], { type: 'increment', id: 'a' })
    expect(state[0].value).toBe(MAX_VALUE)
  })

  it('resets all and restores a removed counter at its old position', () => {
    let state = [c('a', 3), c('b', 4), c('c', 5)]
    state = countersReducer(state, { type: 'resetAll' })
    expect(state.every((x) => x.value === 0)).toBe(true)
    const removed = state[1]
    state = countersReducer(state, { type: 'remove', id: 'b' })
    state = countersReducer(state, { type: 'restore', counter: removed, index: 1 })
    expect(state.map((x) => x.id)).toEqual(['a', 'b', 'c'])
  })
})

describe('storage', () => {
  it('round-trips counters and ignores malformed data', () => {
    saveCounters([c('a', 7, 2)])
    expect(loadCounters()).toEqual([c('a', 7, 2)])
    localStorage.setItem('counter-board:v2', '[{"id":1,"value":"x"}]')
    expect(loadCounters()[0].id).toBe('coffee')
    localStorage.setItem('counter-board:v2', '{not json')
    expect(loadCounters()[0].id).toBe('coffee')
  })
})
