const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const assert = require('node:assert')

const api = supertest(app)

beforeEach(async ()=>{
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test.only('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test.only('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test.only('blogs unique identifier is id', async () => {
  const response = await api.get('/api/blogs')

  const firstBlog = response.body[0]

  assert.ok(firstBlog.id)
  
  assert.strictEqual(firstBlog._id, undefined)
  
  assert.strictEqual(firstBlog.__v, undefined)
})

test.only('one blog is being insert', async () => {
  const newBlog = {
    title: "Il mio terzo post",
		author: "Mario Rossi",
		url: "https://miosito.it/post3",
		likes: 5
  }

  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const contents = response.body.map(r => r.title)

  assert.strictEqual(helper.initialBlogs.length+1,response.body.length)

  assert(contents.includes('Il mio terzo post'))
})

after(async () => {
  await mongoose.connection.close()
})
