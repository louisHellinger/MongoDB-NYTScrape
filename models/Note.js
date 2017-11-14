var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({

   comment: {
    type: String,     
    },   
    userCreated: {
      type: Date,
      default: Date.now
   },
  articleId: String
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
