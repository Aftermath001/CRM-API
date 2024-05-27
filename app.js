require('dotenv').config()
// Express to handle our routing
const express = require("express")
const app = express()
// Body parser to pass incoming http requests from router
const bodyParser = require("body-parser")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const port = process.env.PORT || 3001
const mongoose = require("mongoose");


// APP security
app.use(helmet())

// Handle CORS error
app.use(cors())

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Logger
app.use(morgan("tiny"))

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json())

// Load Routers
const userRouter = require("./src/routers/user.router")
const ticketRouter = require("./src/routers/ticket.router")
// const tokensRouter = require("./src/routers/tokens.router")

// Use Routers
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter)
// app.use("/v1/tokens", tokensRouter)

// Error Handler
const handleError = require("./src/utils/errorHandler")

app.use((req, res, next) => {
    const error = new Error ("RESOURCE NOT FOUND")
    error.status = 404
    next(error);
});

app.use((error,req,res, next)=> {
    handleError(error,res)
})

app.listen(port, ()=> {
    console.log(`API is ready on http://localhost:${port}`)
});
