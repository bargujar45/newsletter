//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

  .get(function(req, res) {
    Article.find({}, function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      }
    });
  })

  .post(function(req, res) {

    const article = new Article({
      title: req.body.title,
      content: req.body.content
    });

    article.save(function(err) {
      if (!err) {
        res.send("successfully added");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send("sucessfully deleted");
      } else {
        res.send(err);
      }
    });

  });

app.route("/articles/:articleName")

  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleName
    }, function(err, foundArticle) {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send(err);
      }
    });
  })

  .put(function(req,res){
    Article.update(
      {title: req.params.articleName},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if(!err){
          res.send("sucessfully updated");
        }
      }
    )
  })

  .patch(function(req,res){
    Article.update(
      {title: req.params.articleName},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("sucessfully updated");
        }
      }
    )
  })

  .delete(function(req,res){
    Article.deleteOne({title: req.params.articleName}, function(err) {
      if (!err) {
        res.send("sucessfully deleted");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
