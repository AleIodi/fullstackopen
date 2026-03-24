const express = require('express')
const morgan = require('morgan')
require('dotenv').config()

const app = express()

morgan.token('body', (req, res) => {
	return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

const Person = require('./models/person')

app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons)
	})
})

/*
app.get('/info', (request, response) => {
	response.send(`
		<p>Phonebook has info for ${persons.length} people</p>
		<p>${new Date()}</p>
	`)
})
*/

app.get('/api/persons/:id', (request, response) => {
	Person.findById(request.params.id).then(person => {
		response.json(person)
	})
})

/*
app.delete('/api/persons/:id', (request, response) => {
	const id = request.params.id
	const person = persons.find(p => p.id === id)
	if (!person)
		return response.status(404).end()
	persons = persons.filter(p => p.id !== id)
	response.status(204).end()
})
*/

/*
app.post('/api/persons', (request, response) => {
	const body = request.body

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: "name or number is missing"
		})
	}
	else if (persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())) {
		return response.status(400).json({
			error: "name must be unique"
		})
	}
	const person = {
		id: String(Math.floor(Math.random() * 1000000)),
		name: body.name,
		number: body.number

	}
	persons = persons.concat(person)

	response.status(201).json(person)
})
*/

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
