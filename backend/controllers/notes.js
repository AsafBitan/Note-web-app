// controllers/notes.js
const express = require("express");
const Note = require("../models/note");
const User = require("../models/user");
const loger = require("../loger");

const notesRouter = express.Router();

// Get all notes
notesRouter.get("/", async (request, response) => {
  try {
    loger(request);
    const notes = await Note.find({});
    if (notes) {
      response.json(notes);
    } else {
      response.status(404).send("Notes not found");
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Server error" });
  }
});

// Get note by ID
notesRouter.get("/:id", async (request, response) => {
  try {
    loger(request);
    const note = await Note.findOne({ id: request.params.id });
    if (note) {
      response.json(note);
    } else {
      response.status(404).send("Note not found");
    }
  } catch (error) {
    console.error(error);
    response.status(400).send("Bad request");
  }
});

notesRouter.get("/page", async (request, response) => {
  try {
    loger(request);
    const activePage = parseInt(request.query._page) || 1;
    const notesPerPage = parseInt(request.query._per_page) || 10;

    const notes = await Note.find()
      .skip((activePage - 1) * notesPerPage)
      .limit(notesPerPage);

    if (notes) {
      response.json(notes);
      console.log(notes);
    } else {
      response.status(404).send("Notes not found");
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Server error" });
  }
});

notesRouter.get("/total_notes", async (request, response) => {
  try {
    loger(request);
    const totalNotes = await Note.countDocuments({});
    response.json(totalNotes);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Server error" });
  }
});

// Create a new note
notesRouter.post("/", async (request, response) => {
  try {
    loger(request);
    const { name, email, content } = request.body;

    if (!name || !email || !content) {
      return response.status(400).json({ error: "All fields are required" });
    }

    const tempNote = await Note.findOne({}, "id").sort({ id: -1 }).exec();
    const lastId = tempNote ? tempNote.id : 0;

    const user = await User.findOne({ name });
    if (!user) {
      return response.status(400).json({ error: "User not found" });
    }

    const title = "Note" + (lastId + 1);
    const note = new Note({
      id: lastId + 1,
      title: title,
      author: {
        name: name,
        email: email,
      },
      content,
    });

    const savedNote = await note.save();
    response.status(201).json(savedNote);
  } catch (error) {
    console.error(error);
    response.status(400).json({ error: "Failed to post note" });
  }
});

// Update a note
notesRouter.put("/:id", async (request, response) => {
  try {
    loger(request);
    const updatedNote = await Note.findOneAndUpdate(
      { id: request.params.id },
      { content: request.body.content },
      { new: true }
    );
    if (updatedNote) {
      response.json(updatedNote);
    } else {
      response.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    console.log(error);
    response.status(400).json({ error: "Failed to update note" });
  }
});

// Delete a note
notesRouter.delete("/:id", async (request, response) => {
  try {
    loger(request);
    const deletedNote = await Note.deleteOne({ id: request.params.id });
    if (deletedNote) {
      response.status(204).json({ message: "Note deleted Successfully" });
    } else {
      response.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    console.log(error);
    response.status(400).json({ error: "Failed to delete note" });
  }
});

module.exports = notesRouter;
