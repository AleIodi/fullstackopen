import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import anecdoteService from './services/anecdotes'

vi.mock('./services/anecdotes', () => ({
	default: {
		getAll: vi.fn(),
		createNew: vi.fn(),
		update: vi.fn(),
	}
}))

import useAnecdoteStore, { useAnecdotes, useAnecdoteActions, useFilter } from './store'

beforeEach(() => {
	useAnecdoteStore.setState({ anecdotes: [], filter: '' })
	vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
	it('initialize loads anecdotes from service', async () => {
		const mockAnec = [{ id: 1, content: 'Test', votes: 0 }]
		anecdoteService.getAll.mockResolvedValue(mockAnec)

		const { result } = renderHook(() => useAnecdoteActions())

		await act(async () => {
			await result.current.inizialize()
		})

		const { result: anecResult } = renderHook(() => useAnecdotes())
		expect(anecResult.current).toEqual(mockAnec)
	})
})
