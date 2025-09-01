require("dotenv").config()
const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}

const password = process.env.MONGODB_PASSWORD || process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://initxmahesh:${password}@phonebook.qb803ki.mongodb.net/?retryWrites=true&w=majority&appName=Phonebook`

mongoose.set("strictQuery",false)

mongoose.connect(url).then(() => {
  console.log("successfully connected to the mongodb")
})

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model("Person", phoneSchema)

if (process.argv.length === 3){
  Person.find({}).then(persons => {
    console.log(persons)
    console.log("phonebook:")
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
else if (process.argv.length === 5){
  const person = new Person({ name, number })
  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
