  var express = require("express");
  var router = express.Router();
  var axios = require("axios");
  var cheerio = require("cheerio");

  var db = require("../models");


  // Scrape Route for getting articles, save each result in an object and push to the page
  router.get("/scrape", function(req, res) {

    axios.get("https://www.nytimes.com/section/us").then(function(response) {

      var $ = cheerio.load(response.data);

      $("div.story-body").each(function(i, element) {

        var result = {};

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
          .catch(function(err) {
            // If an error occurred, send it to the client
            if (err) {
              return res.send();
            }

            res.json("Scrape Complete");

          });
      });
    });
  });

  router.get("/", function(req, res) {

    db.Article.find({})
      .sort({userCreated: -1})
      .populate("note")
      .then(function(data) {

        // console.log(data[0].note);

        // res.json(data);
        res.render("index", {
          title: "Mongo Scraper",
          article: data,

        }).catch(function(err) {
          if (err) {
            return res.send();
          }
        });
      });
  });


  // Route for getting all Articles from the db
  router.get("/articles", function(req, res) {

    db.Article.find({}, function(err, data) {

      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

  // Route for saving/updating an Article's associated Note
  router.post("/articles/:id", function(req, res) {

    var id = req.params.id;
    console.log(req.body);

    db.Note
      .create(req.body)
      .then(function(newNote) {

        return db.Article.update({
          _id: req.params.id
        }, {
          $push: {
            note: newNote._id
          }
        }, {
          new: true
        }).then(function(dbArticle) {
          res.json(dbArticle);

        }).catch(function(err) {
          if (err) {
            return res.send();
          }
        });

      })
  });


  router.get("/saved-articles", function(req, res) {

    db.Article.find({})
      .populate("note")
      .then(function(data) {

        console.log(data[0].note);

        // res.json(data);
        res.render("saved", {
          title: "Saved Articles",
          article: data,

        }).catch(function(err) {

          if (err) {
            return res.send();
          }

        });
      });
  });



  router.get("/saved-notes/:id", function(req, res) {
    var articleId = req.params.id;

    console.log(articleId);

    db.Article.find({})
      .populate("note")
      .then(function(dbNote) {
        // res.json(dbNote[0].note[0].comment); 
        //console.log(dbNote.note[0].comment);
      })
      .catch(function(err) {

        res.json(err);
      });
  });


  router.post("/api/delete-note/:id", function(req, res) {

    var id = req.params.id;

    db.Note.deleteOne({
      _id: req.params.id
    }).then(function(dbNote) {
      // console.log("dbNote before");
      // console.log(dbNote);
      res.JSON(dbNote);

    });
  });

  router.post("/api/save-article/:id", function(req, res) {

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

        }).catch(function(err) {
       if (err) {
            return res.send();
          } 
});

    });
  });


  router.post("/api/unsave-article/:id", function(req, res) {

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

    }).catch(function(err) {
       if (err) {
            return res.send();
          } 
});
  });



  router.get("/notes/:id", function(req, res) {

    var id = req.params.id;
    // console.log(id);

    db.Note
      .find({
        "articleId": id
      })
      .then(function(newNote) {
        //  console.log("==========this is the new Note variable===========");
        // console.log(newNote);

        for (var i = 0; i < newNote.length; i++) {
          console.log(newNote[i]);
        };

      }).catch(function(err) {
       if (err) {
            return res.send();
          } 
});
  });

  module.exports = router;