
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    addVote: async (id) => {
      const anec = get().anecdotes.find(a => a.id === id)
      const response = await anecdoteService.update(id, {...anec, votes: anec.votes+1})
      set(state => ({ anecdotes: state.anecdotes.map(a => a.id === id ? response : a) }))
    },

    addAnectode: async (anectode) => {
      const newAnecdote = await anecdoteService.createNew(anectode)
      set(state => ({ anecdotes: state.anecdotes.concat(newAnecdote) }))
    },

    setFilter: value => set({ filter: value }),

    inizialize: async () => {
      const arr = await anecdoteService.getAll()
      set({ anecdotes: arr })
    }
  },
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)

  if (filter.trim() === '')
    return anecdotes
  return anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
}
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
