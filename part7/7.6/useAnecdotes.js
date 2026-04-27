import { useEffect, useState } from "react"
import anecdoteService from '../services/anecdotes'

export const useAnecdotes = () => {
	const [anecdotes, setAnecdotes] = useState([])

	useEffect(() => {
		anecdoteService.getAll().then(data => setAnecdotes(data))
	}, [])

	const addAnecdote = async (anecdote) => {
		const res = await anecdoteService.createNew(anecdote)
		setAnecdotes(anecdotes.concat(res))
	}

	const deleteAnecdote = async (id) => {
		await anecdoteService.remove(id)
		setAnecdotes(anecdotes.filter(a => a.id !== id))
	}

	return { anecdotes, addAnecdote, deleteAnecdote }
}