import { useAnecdoteActions } from "../store"

const AnecdoteForm = () => {
	const { addAnectode } = useAnecdoteActions()
	const generateId = () => Number((Math.random() * 1000000).toFixed(0))

	const handleAdd = (e) => {
		e.preventDefault()
		const content = e.target.anecdote.value
		if (content.trim() !== "")
			addAnectode({ id: generateId(), content: content, votes: 0 })
		e.target.reset()
	}
	return (
		<div>
			<h2>create new</h2>
			<form onSubmit={handleAdd}>
				<div>
					<input name="anecdote" />
				</div>
				<button type="submit">create</button>
			</form>
		</div>
	)
}

export default AnecdoteForm
