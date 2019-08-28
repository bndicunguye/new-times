var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var express = require("express");
var exphbs = require("express-handlebars");


var db = require("./models");

var PORT = 3002;

var app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });
app.get("/", function(req, res) {
  console.log('9999')
  db.Article.find({})
    .then(function(article) {
     
     res.render("index",{article:article});
    })
    .catch(function(err) {
      
      res.json(err);
    });
});

app.get("/scrape", function(req, res) {

  axios.get("https://old.reddit.com/r/webdev").then(function(response) {

    var $ = cheerio.load(response.data);

    $(".thing").each(function(i, element) {
     
      var result = {};

      console.log($(this).find($(".may-blank")).attr("href"))

         result.title = $(this).find($(".may-blank")).text()
         result.link = $(this).find($(".may-blank")).attr("href")

      db.Article.create(result)
        .then(function(dbArticle) {
         
          console.log(dbArticle);
        })
        .catch(function(err) {
          
          console.log(err);
        });
    });

    
    res.send("Scrape Complete");
  });
});



app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
