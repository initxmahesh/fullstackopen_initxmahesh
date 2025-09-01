require("dotenv").config()
const express = require("express")
const Person = require("./models/person")
var morgan = require("morgan")
const app = express()
const cors = require("cors")

app.use(express.static("dist"))
app.use(express.json())
app.use(cors())

morgan.token("body", (req) =>
  req.method === "POST" ? JSON.stringify(req.body) : ""
)
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
)

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if(person){
      response.json(person)
    }else {
      response.status(404).send("Data not Found")
    }
  })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(person => {
    console.log(person)
    if(person){
      response.status(204).end()
    }else {
      response.status(404).send("Person not found")
    }
  })
    .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "No name or number",
    })
  }

  // Person.findOne({name}).then(person => {
  //   if(person){
  //     return response.status(400).json({error: 'name must be unique'})
  //   }
  // })

  const person = new Person({
    name:body.name,
    number: body.number
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body
  const id = request.params.id
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "No name or number" })
  }

  const updatedPerson = { name: body.name, number: body.number }
  console.log(updatedPerson)
  Person.findByIdAndUpdate(id, updatedPerson, { new: true, runValidators: true, context: "query" }).then(updated => {
    console.log(updated)
    if (updated) {
      response.json(updated)
    } else {
      response.status(404).json({ error: "Person not found" })
    }
  })
    .catch(error => next(error))
})

app.get("/info", (request, response, next) => {
  Person.countDocuments({}).then(length => {
    response.send(`<p>Phone has info for ${length} people<p>
      <p>${new Date()}</p>`)
  })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT ? process.env.PORT : 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
