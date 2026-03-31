const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  if(!request.body.title||!request.body.url)
    response.status(400).end()
  else{
    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes??0,
    })

    const result=await blog.save()
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
