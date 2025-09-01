require("dotenv").config()
const mongoose = require("mongoose")

mongoose.set("strictQuery",false)

const url = process.env.MONGODB_URI

console.log("connecting to", url)
mongoose.connect(url).then(() => {
  console.log("successfully connected to the mongodb")
})
  .catch(error => {
    console.log("error connecting to MongoDB:", error.message)
  })

const phoneSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    validate: function (number) {
      return /^\d{2,3}-\d+$/.test(number)
    },
    required: true
  }
})

phoneSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model("Person", phoneSchema)

module.exports = Person