var mongoose = require("mongoose");

// Reference to the schema constructor
var Schema = mongoose.Schema;

// Create schema object
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },

    // Determines if the article has been saved, which determines where it is displayed
    saved: {
        type: Boolean,
        default: false
    },

    // Populates the Article with an associated note
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
});

// Creates model using the article schema leveraging the mongoose model method
var Article = mongoose.model("Article", ArticleSchema);

// Export Article model
module.exports = Article;