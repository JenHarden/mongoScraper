// Required dependencies
var express = require("express");
var router = express.Router();

// Require all models
var db = require("../models");

// Route to retrieve all saved Articles from the db
router.get("/saved-articles", function(req, res) {

    db.Article.find({})
    .then(function(savedData) {

        // Save all saved articles into a handlebars object
        var hbsObject = {articles:savedData};
        console.log(hbsObject);

        // Send all found articles as an object to be used in handlebars
        res.render("saved", hbsObject);
    })
    .catch(function(error) {

        // If error occurs, send error
        res.json(error);
    });
});

// Route to return a saved Article and populate it with notes
router.get("/getnotes/:id", function(req,res) {

    // Find the article by the req.params.id
    db.Article.findOne(
        {_id: req.params.id}
    )

    // Reference documents in notes collection
    .populate("notes")

    // Respond with the article and note
    .then(function(dbArticle) {

        // If Articles are found, send them
        res.json(dbArticle);
    })
    .catch(function(error) {

        // If error occurs, send error
        res.json(error);
    });
});

// Route for saving a note for an Article
router.post("/postnotes/:id", function(req, res) {

    // Save the new note that gets posted to the Notes collection
    console.log(req.body);
    console.log("!!!!!!LOOK AT ME!!!!!!!!!");
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate(
            {_id: req.params.id},
            {$push:
                {notes: dbNote._id}
            },
            {new: true }
        );
    })

    // Respond with the article and note
    .then(function(dbArticle) {

        // If Articles are found, send them
        res.json(dbArticle);
    })
    .catch(function(error) {

        // If error occurs, send error
        res.json(error);
    });
});

// Route for updating a note
router.get("/getsinglenote/:id", function(req,res) {
    db.Note.findOne(
        {_id: req.params.id}
    )
    .then(function(result) {
        res.json(result);
    })
    .catch(function(error) {

        // If error occurs, send error
        res.json(error);
    });
});

// Route for deleting a note
router.delete("/deletenote/:id", function(req,res) {
    db.Note.remove(
        {_id: req.params.id}
    )
    .then(function(dbNote) {
        res.json(dbNote);
    })
    .catch(function(error) {

        // If error occurs, send error
        res.json(error);
    });
});

// Route to unsave an Article
router.put("/returned/:id", function(req, res) {

    // Update the article's saved boolean to false
    db.Article.update(
        {_id: req.params.id},
        {saved: false}
    )
    .then(function(result) {
        res.json(result);
    })
    .catch(function(error) {

        // If error occurs, send error
        res.json(error);
    });
});

module.exports = router;