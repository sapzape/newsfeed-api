require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const swaggerDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const app = express()
const port = process.env.PORT || 4500

const options = {
  swaggerDefinition: {
    info: {
      title: "News Feed API",
      version: "1.0.0",
      description: "Newsfeed API"
    },
    host: "localhost:4500",
    basePath: "/"
  },
  apis: ["./routes/*.js", "./helpers/swagger/parameters.json"]
}
const swaggerSpec = swaggerDoc(options)

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.Promise = global.Promise
mongoose.set("useCreateIndex", true)
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => console.log("Successfully connected to mongodb"))
  .catch(e => console.log(e))

app.use("/users", require("./routes/users"))
app.use("/schools", require("./routes/schools"))
app.use("/posts", require("./routes/posts"))
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(port, () => console.log(`Server listening on port ${port}`))

module.exports = app
