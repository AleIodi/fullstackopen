import { useAnecdotes, useAnecdoteActions } from '../store'

const AnecdoteList = () => {
	const anecdotes = useAnecdotes()
	const { addVote, removeAnecdote } = useAnecdoteActions()

	return (
		<div>
			{anecdotes
				.toSorted((a, b) => b.votes - a.votes)
				.map(anecdote => (
					<div key={anecdote.id}>
						<div>{anecdote.content}</div>
						<div>
							has {anecdote.votes}
							<button onClick={() => addVote(anecdote.id)}>vote</button>
							{anecdote.votes === 0 && (<button onClick={() => removeAnecdote(anecdote.id)}>delete</button>)}
						</div>
					</div>
				))}
		</div>
	)
}

export default AnecdoteList
