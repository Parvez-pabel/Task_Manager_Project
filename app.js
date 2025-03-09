//Basic library import

const express = require("express");
const router = require("./parvez-alom-task-mg-project-backend/src/routes/api");
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

mongoose
  .connect(
    "mongodb+srv://parvez:parvez122509@universal-database.8e02k.mongodb.net/taskManager"
  )
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Error connecting to the database:", err));

//security middleware implement
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(ExpressMongoSanitize());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//body parser implement
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
//rate limiter middleware

const limiter = rateLimit({
  windowMs: 24 * 60 * 1000, // 15 minutes
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
