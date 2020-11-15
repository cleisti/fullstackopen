require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('body', (req) => {
	return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const requestLogger = (request, response, next) => {
	console.log('Method:', request.method)
	console.log('Path:  ', request.path)
	console.log('Body:  ', request.body)
	console.log('---')
	next()
}

app.use(requestLogger)

app.get('/api/persons', (request, response) => {
	console.log('get all persons')
	Person.find({}).then(people => {
		response.json(people)
	})
})

app.get('/api/info', (request, response) => {
	console.log('get info')
	const date = new Date()
	Person.find({}).then(people => {
		const content = `<p>Phonebook has info for ${people.length} people</p><p>${date}</p>`
		response.send(content)
	})
})

app.get('/api/persons/:id', (request, response, next) => {
	console.log('get one person')
	Person.findById(request.params.id)
		.then(person => {
			if (person)
				response.json(person)
			else
				response.status(404).end()
		})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	console.log('delete one person')
	Person.findByIdAndDelete(request.params.id)
		.then( () => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
	const body = request.body

	if (!body.name) {
		return response.status(400).json({ error: 'name missing' })
	}
	if (!body.number) {
		return response.status(400).json({ error: 'number missing' })
	}

	const person = new Person({
		name: body.name,
		number: body.number
	})
	console.log(person)

	person.save()
		.then(savedPerson => {
			console.log('person saved')
			response.json(savedPerson.toJSON())
		})
		.catch(error => {
			next(error)
		})
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body

	const person =  {
		name: body.name,
		number: body.number
	}

	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then(updatedPerson => {
			response.json(updatedPerson)
		})
		.catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.log(error.message)
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}
	next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})