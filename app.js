
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

//for all articles

app.route("/articles")

.get(function (req, res) {
    Article.find()
        .then(function(foundArticles){
            res.send(foundArticles);
        })
        .catch(function(err){
            res.send(err);
        });
})

.post(function(req, res) {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save()
        .then(function() {
            res.send("Successfully added a new article");
        })
        .catch(function(err) {
            res.send(err);
        });
})

.delete(function(req, res) {
    Article.deleteMany()
        .then(function() {
            res.send("Successfully deleted all articles");
        })
        .catch(function(err) {
            res.send(err);
        });
});

//for specific articles

app.route("/articles/:articleTitle")
.get(function(req, res) {
    Article.findOne({
            title: req.params.articleTitle
        })
        .then(function(foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found");
            }
        })
        .catch(function(err) {
            res.send(err);
        });
})

.put(function(req, res) {
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {new: true}
    )
    .then(function(foundArticle) {
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No articles matching that title was found");
        }
    })
    .catch(function(err) {
        res.send(err);
    });
})

.patch(function(req, res) {
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
    )
    .then(function(foundArticle) {
        if (foundArticle) {
            if (req.body.title) {
                foundArticle.title = req.body.title;
            }
            if (req.body.content) {
                foundArticle.content = req.body.content;
            }
            foundArticle.save()
                .then(function() {
                    res.send(foundArticle);
                })
                .catch(function(err) {
                    res.send(err);
                });
        } else {
            res.send("No articles matching that title was found");
        }
    })
    .catch(function(err) {
        res.send(err);
    });
})

.delete(function(req, res) {
    Article.deleteOne(
        {title: req.params.articleTitle}
    )
    .then(function(foundArticle) {
        if (foundArticle) {
            res.send("Successfully deleted the article");
        } else {
            res.send("No articles matching that title was found");
        }
    })
    .catch(function(err) {
        res.send(err);
    });
});











//TODO

app.listen(3000, function () {
    console.log("Server started on port 3000");
});