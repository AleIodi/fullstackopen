
import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'
import Filter from './components/Filter'
import { useEffect } from 'react'
import { useAnecdoteActions } from './store'
import Notification from './components/Notification'

const App = () => {
  const { inizialize } = useAnecdoteActions()
  useEffect(() => {
    inizialize()
  }, [inizialize])
  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App
