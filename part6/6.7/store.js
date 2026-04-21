
import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'
import Filter from './components/Filter'
import { useEffect } from 'react'
import { useAnecdoteActions } from './store'
import anecdotesService from './services/anecdotes'

const App = () => {
  const { inizialize } = useAnecdoteActions()
  useEffect(() => {
    anecdotesService.getAll().then(res => inizialize(res))
  }, [inizialize])
  return (
    <div>
      <Filter />
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App
