var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("../models");

router.get("/", function(req, res) {
	
	db.Article.find({},function (err,data){
		// console.log(data);
    
    if (err) {
      console.log(err);
    } else {
      // res.json(data);
      res.render("index", {
			title: "Mongo Scraper",
			article: data
	
		});
       }
});
   
  });
		

// Route for getting all Articles from the db
router.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({},function (err,data){
    
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  });
});


router.get("/saved-articles", function(req, res) {

  db.Article.find({},function (err,data){
    // console.log("saved route data===========================================================");
    // console.log(data);
    
    if (err) {
      console.log(err);
    } else {
      // res.json(data);
      res.render("saved", {
        article:data
      })

    }
  });
});


module.exports = router;
