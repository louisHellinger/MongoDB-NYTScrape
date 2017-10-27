var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var routes = require("./controller/mongo-controller.js");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = var port = process.env.PORT || 3300;

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
mongoose.connect("mongodb://localhost/NYTScraper", {
  useMongoClient: true
});



// Routes
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.nytimes.com/section/us").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    // Now, we grab every h2 within an article tag, and do the following:
    $("div.story-body").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a.story-link")
        .children("div.story-meta")
        .children("h2.headline")
        .text().trim();

      result.link = $(this)
        .children("a.story-link")
        .attr("href");

      result.summary = $(this)
        .children("a.story-link")
        .children("div.story-meta")
        .children("p.summary")
        .text();

      // Create a new Article using the `result` object built from scraping
      db.Article
        .create(result)
        .then(function(dbArticle) {
          console.log("Scrape Complete!");
          res.send("Scrape Complete");
          console.log("===========  here are the articles   ============");
          console.log(dbArticle);

        })
        .catch(function(err, data) {
          // If an error occurred, send it to the client
          if (err) {
            return res.send();
          } 

          res.json("Scrape Complete");

        });

    });

  });


});


app.post("/api/save-article/:id", function(req, res) {

  console.log("made it to the click route");

  var id = req.params.id;

  db.Article.find({
    _id: req.params.id
  }).then(function(dbArticle) {
    console.log("dbArt before");
    console.log(dbArticle);

    db.Article
      .findOneAndUpdate({
        "_id": id
      }, {
        $set: {
          "unsaved": false
        }
      }, {
        new: true
      })
      .then(function(data) {
        res.json(data);
        console.log(data);

      });

  });
});


app.post("/api/unsave-article/:id", function(req, res) {

  console.log("made it to the click route");

  var id = req.params.id;

  db.Article.find({
    _id: req.params.id
  }).then(function(dbArticle) {
    console.log("dbArt before");
    console.log(dbArticle);

    db.Article
      .findOneAndUpdate({
        "_id": id
      }, {
        $set: {
          "unsaved": true
        }
      }, {
        new: true
      })
      .then(function(data) {
        res.json(data);
        console.log(data);

      });

  });
});



// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {

  var id = req.params.id;
  console.log(req.body);

  db.Note
    .create(req.body)
    .then(function(newNote) {

      return db.Article.update({
        _id: req.params.id
      }, 
      {$push: { note: newNote._id }
      }, {
        new: true
      }).then(function(dbArticle) {
        res.json(dbArticle);

      });

    })
});



app.get("/notes/:id", function(req, res) {

  var id = req.params.id;
  console.log(id);
  db.Note
    .find({"articleId": id})
    .then(function(newNote) {
     //  console.log("==========this is the new Note variable===========");
     // console.log(newNote);

     for (var i = 0; i < newNote.length; i++) {
       console.log(newNote[i]);
     };

      }).then(function(returnNote) {

        // console.log("==========this is the return Note===========");
        // console.log(returnNote);

      });

    });

    
app.get("/savednotes/id", function(req, res) {
  var articleId = req.params.id;

  console.log(articleId);

  db.Article.find( {"_id": "59f2a5fa72a95e240c55065d"})
  .populate("note")
  .then(function(dbNote) {
    res.json(dbNote);
    console.log(dbNote);
  })
  .catch(function(err) {
  // If an error occurs, send it back to the client
    res.json(err);
  });
});

// app.get("/savednotes/:id", function(req, res) {

//   var articleId = req.params.id;
//   console.log("req.params===================");
//   console.log(articleId);

//   // Using our Library model, "find" every library in our db and populate them with any associated books
//   db.Note
//     .find({articleId: articleId})
//     .then(function(dbLibrary) {
//       res.json(dbLibrary);

//       for (var i = 0; i < dbLibrary.length; i++) {
//         console.log(dbLibrary[i].comment);

//         var newComment = $("<div>");
//         var commentText = dbLibrary[i].comment;

//         newComment.text(commentText);
//         $("#comments").append(newComment);   
//       };

//       //console.log(dbLibrary);
//     })
//     .catch(function(err) {
//       // If an error occurs, send it back to the client
//       res.json(err);
//     });
// });
    
   



// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});