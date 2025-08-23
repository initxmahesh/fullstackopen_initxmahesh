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

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  })
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findById(id).then(person =>{
    if(person){
      response.json(person)
    }else {
      response.status(404).send("Data not Found")
    }
  })
})

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id).then(person =>{
    console.log(person)
    if(person){
      response.status(204).end()
    }else {
      response.status(404).send('Person not found')
    }
  })
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "No name or number",
    });
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
  person.save().then(savedPerson =>{
    response.json(savedPerson)
  })
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
  Person.countDocuments({}).then(length => {
    response.send(`Phone has info for ${length} people
      <p>${new Date()}</p>`)
  })
});

const PORT = process.env.PORT ? process.env.PORT : 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
