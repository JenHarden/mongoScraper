// Required dependencies
var express = require("express");
var router = express.Router();

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

// Route for scraping
router.get("/scrape", function (req, res) {

    // Get the entire body of the html with a request
    axios.get("https://www.theonion.com/c/news-in-brief")
        .then(function (response) {

            // Use cheerio to load the response and save it
            var $ = cheerio.load(response.data);

            // Get every h3 within an article tag
            $("article").each(function (i, element) {

                // Save an empty result object
                var result = {};
                console.log(result);

                // Get the text and href of every link, save them as properties of the result object
                result.title = $(this).find("h1.headline").text();
                result.link = $(this).find("h1.headline").children("a").attr("href");
                result.summary = $(this).find("div.excerpt").children("p").text();
                result.image = $(this).find("picture").children("source").attr("data-srcset");

                // Create a new Article with the result object built from scraping
                db.Article.create(result)
                    .then(function (dbArticle) {

                        // View the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function (error) {

                        // If error occurs, send error
                        return res.json(error);
                    });
            });

            // Alert when scraping complete
            res.send("Scrape was successful!");
        });
});

// ********** Routes to export **********

// Route to get all Articles from the db
router.get("/", function (req, res) {

    // Limit to only show first 20 articles
    db.Article.find({}).limit(20)
        .then(function (scrapedData) {

            // Save all scraped data into a handlebars object
            var hbsObject = { articles: scrapedData };
            console.log(hbsObject);

            // Send all found articles as an object to be used in handlebars
            res.render("index", hbsObject);
        })
        .catch(function (error) {

            // If error occurs, send error
            res.json(error);
        });
});

// Route to save an Article
router.put("/saved/:id", function (req, res) {

    // Update the article's saved boolean to true
    db.Article.update(
        { _id: req.params.id },
        { saved: true }
    )
        .then(function (result) {
            res.json(result);
        })
        .catch(function (error) {

            // If error occurs, send error
            res.json(error);
        });
});

// Route to clear the Articles collection and notes
router.delete("/drop-articles", function (req, res, next) {
    db.Article.remove({}, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("articles dropped!");
        }
    })
        .then(function (dropnotes) {
            db.Note.remove({}, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("notes dropped!");
                }
            })
        })
});

module.exports = router;