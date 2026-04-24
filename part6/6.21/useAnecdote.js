import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAll, createNew, update } from '../requests'
import useNotification from './useNotification'

export const useAnecdotes = () => {
	const queryClient = useQueryClient()

	const { showNotification } = useNotification()

	const updateAnecdoteMutation = useMutation({
		mutationFn: update,
		onSuccess: (updatedAnecdote) => {
			const anecdotes = queryClient.getQueryData(['anecdotes'])
			queryClient.setQueryData(
				['anecdotes'],
				anecdotes.map(a => a.id === updatedAnecdote.id ? updatedAnecdote : a)
			)
		}
	})

	const newAnecdoteMutation = useMutation({
		mutationFn: createNew,
		onSuccess: (anecdote) => {
			const anecdotes = queryClient.getQueryData(['anecdotes'])
			queryClient.setQueryData(['anecdotes'], anecdotes.concat(anecdote))
			showNotification(`New anecdote '${anecdote.content}' added`)
		},
		onError: (error) => {
			showNotification(error.message)
		}
	})

	const result = useQuery({
		queryKey: ['anecdotes'],
		queryFn: getAll,
		refetchOnWindowFocus: false
	})

	const anecdotes = result.data

	return {
		isPending: result.isPending,
		isError: result.isError,
		anecdotes,
		vote: (anecdote) => updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 }),
		addAnecdote: (content) => newAnecdoteMutation.mutate({ id: (100000 * Math.random()).toFixed(0), content, votes: 0 })
	}
}
