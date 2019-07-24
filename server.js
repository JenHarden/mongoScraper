// ********** Dependencies **********
// Required dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var exphbs = require("express-handlebars");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// ********** Setup Database **********
// Use the deployed or local database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongo-scraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

// Initialize Express
var app = express();

// ********** Configure Middleware **********
// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({
    type: "application/json"
}));

// Serve public directory
app.use(express.static("public"));

// Set handlebars
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Import and use routes
var scraperRoutes = require("./controllers/controller.js");
var savedRoutes = require("./controllers/saved-articles.js");
app.use(scraperRoutes, savedRoutes);

// Start the server
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});