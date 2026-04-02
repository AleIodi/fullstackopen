const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

describe('blog list tests', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('when there is initially some blogs saved', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('unique identifier property is named id', async () => {
      const response = await api.get('/api/blogs')
      const firstBlog = response.body[0]

      assert.ok(firstBlog.id)
      assert.strictEqual(firstBlog._id, undefined)
      assert.strictEqual(firstBlog.__v, undefined)
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
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

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(titles.includes('Il mio terzo post'))
    })

    test('if likes property is missing, it defaults to 0', async () => {
      const newBlog = {
        title: "Post without likes",
        author: "Mario Marroni",
        url: "https://miosito.it/post4",
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

      assert.strictEqual(response.body.likes, 0)
    })

    test('fails with status code 400 if title or url are missing', async () => {
      const newBlog = {
        author: "Mario Marroni",
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const ids = blogsAtEnd.map(b => b.id)
      
      assert(!ids.includes(blogToDelete.id))
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  describe('updating a blog', () => {
    test('succeeds with status code 200 and updates likes', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedLikes = {
        likes: 11
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedLikes)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
      
      assert.strictEqual(updatedBlog.likes, 11)
    })
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})

after(async () => {
  await mongoose.connection.close()
})