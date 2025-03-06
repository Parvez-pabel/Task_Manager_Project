//Basic library import

const express = require("express");
const router = require("./src/routes/api");
const app = new express();
const bodyParser = require("body-parser");

// security middleware library import
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const ExpressMongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const cors = require("cors");
const xss = require("xss-clean");

//database library import
const mongoose = require("mongoose");

//connect to mongodb
let URI =
  "mongodb+srv://parvez:parvez122509@universal-database.8e02k.mongodb.net/taskManager";
let OPTION = { autoIndex: true };

mongoose.connect(URI, OPTION, (err) => {
  if (err) console.log(err);
  else console.log("Database connected successfully");
});

//security middleware implement
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(ExpressMongoSanitize());

//body parser implement
app.use(bodyParser.json());

//rate limiter middleware

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

//routing implementation
app.use("/api/v1", router);

//undefine route implement

app.use(
  ("*",
  (req, res) => {
    res.status(404).json({ message: "Page not found" });
  })
);
module.exports = app;
