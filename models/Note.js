var mongoose = require("mongoose");

// Reference to the schema constructor
var Schema = mongoose.Schema;

// Create schema object
var NoteSchema = new Schema ({
    title: String,
    body: String
});

// Creates model using the article schema leveraging the mongoose model method
var Note = mongoose.model("Note", NoteSchema);

// Export Note model
module.exports = Note;