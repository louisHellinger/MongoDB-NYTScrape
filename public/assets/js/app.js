
$.getJSON("/", function(data) {
db.Article.find({});

res.refresh("/");

  });


// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from note textarea
      comment: $("#bodyinput" + thisId).val(),
      articleId: thisId
    }
  })
    .done(function(data) {

      console.log(data); 
       $("#notes").empty();

    });

  // Also, remove the values entered in the input and textarea for note entry
  // $("#bodyinput").val("");
});


$(document).on("click", "#save-article", function() {

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/api/save-article/" + thisId
  })
    .done(function(data) {
      // Log the response
      console.log("this is the Done Data");
      console.log(data);

      location.reload();

    });
});


$(document).on("click", "#unsave-article", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/api/unsave-article/" + thisId
  })
    .done(function(data) {
      // Log the response
      console.log(data);
      location.reload();

    });
});

$(document).on("click", "#scrape-articles", function() {

  $.ajax({
    method: "GET",
    url:"/scrape"
  }).done(function(data){
    console.log(data);
    location.reload();
 
  });
  });


$(document).on("click", "#add-note", function() {

console.log($(this));

var thisId = this.dataset.id;

  $.ajax({
    method: "GET",
    url: "/savednotes/" + thisId,
    data: {
      _id: thisId
    }
  })
    .done(function(data) {
      // res.json(data);
      console.log(data); 
       // $("#notes").empty();

    });


});

