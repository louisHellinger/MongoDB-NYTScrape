var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var routes = require("./controller/mongo-controller.js");

var axios = require("axios");
var cheerio = require("cheerio");


var db = require("./models");

var PORT = process.env.PORT || 3300;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({
  extended: false
}));

// Use express.static to serve the public folder as a static directory
app.use(bodyParser.json());
app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));

app.set("view engine", "handlebars");
app.use("/", routes);

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;

// MONGODB_URI: mongodb://heroku_brz1jhl4:r6iprovaqkep4efpqje52dcl2m@ds237855.mlab.com:37855/heroku_brz1jhl4

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/NYTScraper";

mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});


// Start server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
