
import { useAnecdotes, useAnecdoteActions } from './store'

const App = () => {
  const anecdotes = useAnecdotes()
  const { addVote, addAnectode } = useAnecdoteActions()
  const generateId = () => Number((Math.random() * 1000000).toFixed(0))

  const vote = id => {
    console.log('vote', id)
    addVote(id)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const content= e.target.anecdote.value
    if(content.trim()!=="")
      addAnectode({id: generateId(), content: content, votes:0})
    e.target.reset()
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes
      .toSorted((a,b)=>b.votes-a.votes)
      .map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
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

export default App
