require('dotenv').config()
const express = require("express");
const Person = require('./models/person')
var morgan = require("morgan");
const app = express();
const cors = require("cors");
const password = process.env.MONGODB_PASSWORD || process.argv[2]

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("body", (req) =>
  req.method === "POST" ? JSON.stringify(req.body) : ""
);
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [];

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  })
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).send("Data not Found!");
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "No name or number",
    });
  }
  if (persons.find((p) => p.name === body.name)) {
    return response.status(400).json({ error: "name must be unique" });
  }
  const person = {
    name: body.name,
    number: body.number || false,
    id: String(Math.floor(Math.random() * 1000000)),
  };
  persons = persons.concat(person);
  response.json(person);
  
});

app.put("/api/persons/:id", (request, response) => {
  const body = request.body;
  const id = request.params.id;
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "No name or number" });
  }
  const personIndex = persons.findIndex((p) => p.id === id);
  if (personIndex === -1) {
    return response.status(404).json({ error: "Person not found" });
  }
  const updatedPerson = { ...persons[personIndex], number: body.number };
  persons[personIndex] = updatedPerson;
  response.json(updatedPerson);
});

app.get("/info", (request, response) => {
  const info = `Phonebook has info for ${persons.length} people
  <p>${new Date()}</p>`;
  response.send(info);
});

const PORT = process.env.PORT?process.env.PORT : 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
