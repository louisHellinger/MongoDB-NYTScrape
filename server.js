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



// // Scrape Route for getting articles, save each result in an object and push to the page
// app.get("/scrape", function(req, res) {

//   axios.get("https://www.nytimes.com/section/us").then(function(response) {
 
//     var $ = cheerio.load(response.data);

//     $("div.story-body").each(function(i, element) {
   
//       var result = {};

//       result.title = $(this)
//         .children("a.story-link")
//         .children("div.story-meta")
//         .children("h2.headline")
//         .text().trim();

//       result.link = $(this)
//         .children("a.story-link")
//         .attr("href");

//       result.summary = $(this)
//         .children("a.story-link")
//         .children("div.story-meta")
//         .children("p.summary")
//         .text();

//       // Create a new Article using the `result` object built from scraping
//       db.Article
//         .create(result)
//         .then(function(dbArticle) {
//           console.log("Scrape Complete!");
//           res.send("Scrape Complete");
//           console.log("===========  here are the articles   ============");
//           console.log(dbArticle);

//         })
//         .catch(function(err, data) {
//           // If an error occurred, send it to the client
//           if (err) {
//             return res.send();
//           } 

//           res.json("Scrape Complete");

//         });
//     });
//   });
// });


// app.post("/api/save-article/:id", function(req, res) {

//   console.log("made it to the click route");

//   var id = req.params.id;

//   db.Article.find({
//     _id: req.params.id
//   }).then(function(dbArticle) {
//     console.log("dbArt before");
//     console.log(dbArticle);

//     db.Article
//       .findOneAndUpdate({
//         "_id": id
//       }, {
//         $set: {
//           "unsaved": false
//         }
//       }, {
//         new: true
//       })
//       .then(function(data) {
//         res.json(data);
//         console.log(data);

//       });

//   });
// });


// app.post("/api/unsave-article/:id", function(req, res) {

//   console.log("made it to the click route");

//   var id = req.params.id;

//   db.Article.find({
//     _id: req.params.id
//   }).then(function(dbArticle) {
//     console.log("dbArt before");
//     console.log(dbArticle);

//     db.Article
//       .findOneAndUpdate({
//         "_id": id
//       }, {
//         $set: {
//           "unsaved": true
//         }
//       }, {
//         new: true
//       })
//       .then(function(data) {
//         res.json(data);
//         console.log(data);

//       });

//   });
// });



// // Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function(req, res) {

//   var id = req.params.id;
//   console.log(req.body);

//   db.Note
//     .create(req.body)
//     .then(function(newNote) {

//       return db.Article.update({
//         _id: req.params.id
//       }, 
//       {$push: { note: newNote._id }
//       }, {
//         new: true
//       }).then(function(dbArticle) {
//         res.json(dbArticle);

//       });

//     })
// });



// app.get("/notes/:id", function(req, res) {

//   var id = req.params.id;
//   console.log(id);
//   db.Note
//     .find({"articleId": id})
//     .then(function(newNote) {
//      //  console.log("==========this is the new Note variable===========");
//      // console.log(newNote);

//      for (var i = 0; i < newNote.length; i++) {
//        console.log(newNote[i]);
//      };

//       }).then(function(returnNote) {


//       });
//     });

    
// app.get("/saved-notes/:id", function(req, res) {
//   var articleId = req.params.id;

//   console.log(articleId);

//   db.Article.find({})
//   .populate("note")
//   .then(function(dbNote) {
//     res.json(dbNote[0].note[0].comment);
//     //console.log(dbNote.note[0].comment);
//   })
//   .catch(function(err) {
//   // If an error occurs, send it back to the client
//     res.json(err);
//   });
// });

// app.post("/api/delete-note/:id", function(req, res) {

//   console.log("made it to the delete note route");

//   var id = req.params.id;

//   db.Note.deleteOne({
//     _id: req.params.id
//   }).then(function(dbNote) {
//     console.log("dbNote before");
//     console.log(dbNote);
//     res.JSON(dbNote);

//   });
// });



// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});