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

app
  .route("/articles")
  .get((req, res) => {
    // reading from our database GET STANDS FOR READ

    Article.find((err, foundArticles) => {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send("Error keep off" + err);
      }
    });
  })
  // post request
  .post((req, res) => {
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
  })
  // delete routing
  // Delete articles
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Successfully deleted");
      } else {
        res.send(err);
      }
    });
  });

//////////////////////// requests on a specific article/////////////////
app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne(
      { title: req.params.articleTitle },
      (err, foundArticles) => {
        if (foundArticles) {
          res.send(foundArticles);
        } else {
          res.send("No articles found");
        }
      }
    );
  })
  .put((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (err) => {
        if (!err) {
          res.send("Updated successfully");
        }
      }
    );
  })
  .patch((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send("Successfully updated");
        } else {
          res.send("Unsuccessful");
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
      if (!err) {
        res.send("successfully deleted");
      } else {
        res.send("unsuccessful");
      }
    });
  });

app.listen(3000, () => {
  console.log("Server has started successfully");
});
