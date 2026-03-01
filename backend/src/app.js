const express = require("express")


const app  =express()
const cors = require("cors")
const morgan = require("morgan")
const APiError = require("./utils/APiError")
const ErrorHandling = require("./middlewares/ErrorHandler")
app.use(cors())
app.use(morgan("dev"))
app.use(express.json({limit:'10mb'}))
app.use(express.urlencoded({extended:false}))

app.use("/api/v1",require("./routes"))

app.use("*", (req, res, next) => {
  next(new APiError(404, "Page not found"));
});

app.use(ErrorHandling)
module.exports  =app