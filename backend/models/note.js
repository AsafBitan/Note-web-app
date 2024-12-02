const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    id: {
      type: Number,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    author: {
      name: {
        type: String,
        require: true,
      },
      email: {
        type: String,
        require: true,
      },
    },
    content: {
      type: String,
      require: true,
    },
  });

  const Note = mongoose.model("Note", noteSchema);
  module.exports = Note;