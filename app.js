const mongoose = require("mongoose");
const ejs = require("ejs");
const express = require("express");
const bodyParser = require("body-parser");
const urlencoded = require("body-parser/lib/types/urlencoded");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

// DataBase Connection

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

// Get and Post Requests
//////////////////////////////// For All Articles //////////////////////////////////
app
  .route("/articles")

  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function (req, res) {
    const newArticle = new Article({
      // these are the name attribute of form embedded in html
      // it's for testing the app but there is no form actullay
      //   we test it through Postman
      title: req.body.TitleOfArticle,
      content: req.body.ContentOfArticle,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfulyy Added");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted All Articles");
      } else {
        res.send(err);
      }
    });
  });

//////////////////////////////// For Specific Article //////////////////////////////////
app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (!err) {
          if (foundArticle) {
            res.send(foundArticle);
          } else {
            res.send("There is No article");
          }
        } else {
          res.send(err);
        }
      }
    );
  })
  .put(function (req, res) {
    Article.updateMany(
      { title: req.params.articleTitle },
      { title: req.body.TitleOfArticle, content: req.body.ContentOfArticle },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("successfully update the whole file");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.updateMany(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send(req.body);
          res.send("successfully updated the article");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("deleted Article successfully");
      } else {
        res.send(err);
      }
    });
  });

// server connection
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
