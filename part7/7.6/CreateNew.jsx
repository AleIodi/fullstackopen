import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'
import { useAnecdotes } from '../hooks/useAnecdotes'

const CreateNew = () => {
  const navigate = useNavigate()
  const { reset: resetContent, ...content } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetInfo, ...info } = useField('text')
  const { addAnecdote } = useAnecdotes()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await addAnecdote({ content: content.value, author: author.value, info: info.value, votes: 0 })
    navigate('/')
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' {...content} />
        </div>
        <div>
          author
          <input name='author' {...author} />
        </div>
        <div>
          url for more info
          <input name='info' {...info} />
        </div>
        <button>create</button>
        <button type='button' onClick={() => {
          resetAuthor()
          resetContent()
          resetInfo()
        }}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew
