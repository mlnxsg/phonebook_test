const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

let persons = [
  { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
  },
  { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
  },
  { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
  },
  { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
  }
]

const generateID = () => {
  const min = 5
  const max = 10000
  const id = Math.floor(Math.random() * (max - min + 1)) + min
  return id.toString()
}

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/info', (request, response) => {
  const counter = persons.length
  const now = (new Date()).toString()
  response.send(
    `<p>Phonebook has info for ${counter} people</p>
    <p>${now}<p>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)
  
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json(
      {error: 'name or number missing'}
    )
  }

  if (persons.find(p => p.name === body.name)) {
    return response.status(400).json(
      {error: 'name must be unique'}
    )
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateID()
  }

  persons = persons.concat(person)
  response.json(person)
  console.log('new person', body)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})