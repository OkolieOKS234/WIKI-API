const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app.get("/articles", (req, res) => {
  // reading from our database GET STANDS FOR READ

  Article.find((err, foundArticles) => {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send("Error keep off" + err);
    }
  });
});

app.post("/articles", (req, res) => {
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
  });
  newArticle.save((err) => {
    if (!err) {
      res.send("It was successful");
    } else {
      res.send(err);
    }
  });
});

app.listen(3000, () => {
  console.log("Server has started successfully");
});
