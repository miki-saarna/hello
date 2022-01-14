if (process.env.USER) require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const morgan = require("morgan");
const logger = require("./config/logger")

// require error handler
const notFound = require("./errors/notFound")
const errorHandler = require("./errors/errorHandler");

// routers
const moviesRouter = require('./movies/movies.router');
const reviewsRouter = require('./reviews/reviews.router');
const theatersRouter = require('./theaters/theaters.router');

const app = express();

const knex = require("./db/connection");
app.set('db', knex);
// app.set('db', knex(config));

// app.use(morgan("dev"));
app.use(logger);

app.use(cors());
// CORS API access approval to requesting domain below
app.use(function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Origin", "https://movies-theaters-selection-application.vercel.app");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


// needed to read body from req.body
app.use(express.json());

// routes
app.use("/movies", moviesRouter);
app.use("/reviews", reviewsRouter);
app.use("/theaters", theatersRouter);



// error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
