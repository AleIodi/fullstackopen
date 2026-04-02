const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username:1, name:1})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  if (!request.body.title || !request.body.url || !request.body.userId)
    response.status(400).end()
  else {
    const user = await User.findById(request.body.userId)

    if (!user) {
      return response.status(400).json({ error: 'userId missing or not valid' })
    }
    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes ?? 0,
      user: user._id
    })

    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result)
  }
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  blog.title = body.title ?? blog.title
  blog.author = body.author ?? blog.author
  blog.url = body.url ?? blog.url
  blog.likes = body.likes ?? blog.likes

  const result = await blog.save()
  response.json(result)
})

module.exports = blogRouter
