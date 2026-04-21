
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '',
  actions: {
    addVote: id => set(state => ({
      anecdotes: state.anecdotes.map(a => a.id === id ? { ...a, votes: a.votes + 1 } : a)
    })),
    addAnectode: async (anectode) => {
      const newAnecdote = await anecdoteService.createNew(anectode)
      set(state => ({ anecdotes: state.anecdotes.concat(newAnecdote) }))
    },
    setFilter: value => set({ filter: value }),
    inizialize: async () => {
      const arr = await anecdoteService.getAll()
      set({ anecdotes: arr })}
  },
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)

  if (filter.trim() === '')
    return anecdotes
  return anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
}
export const UseFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
