import { useAnecdotes } from "../hooks/useAnecdotes"

const AnecdoteList = () => {
  const { anecdotes, deleteAnecdote } = useAnecdotes()

  const handleDelete = async (id) => {
    const toDelete = anecdotes.find(anecdotes => anecdotes.id === id)
    if (window.confirm(`Delete '${toDelete.content}' anecdote`)) {
      deleteAnecdote(id)
    }
  }
  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map(anecdote => <li key={anecdote.id}>{anecdote.content}<button type="button" onClick={() => handleDelete(anecdote.id)}>delete</button></li>)}
      </ul>
    </div>
  )
}

export default AnecdoteList
