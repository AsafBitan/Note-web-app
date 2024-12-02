const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const Note = require("./models/note");
const User = require('./models/user');
const loger = require("./loger");
const bcrypt = require('bcrypt');

require("dotenv").config();

const usersRouter = require('./controllers/users')
//const notesRouter = require('./controllers/notes');
const loginRouter = require('./controllers/login')

app.use(express.json());
app.use(cors());
app.use('/users', usersRouter);
// app.use('/notes', notesRouter);
app.use('/login', loginRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//const password = process.argv[2];

const url = process.env.MONGODB_CONNECTION_URL;

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

// get
app.get("/", async (request, response) => {
  loger(request);
  response.send("Full Stack Assignment");
});

app.get("/notes", async (request, response) => {
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

app.get("/notes/page", async (request, response) => {
  try {
    loger(request);
    const activePage = parseInt(request.query._page) || 1;
    const notesPerPage = parseInt(request.query._per_page) || 10;

    const notes = await Note.find()
      .skip((activePage - 1) * notesPerPage)
      .limit(notesPerPage);

    if (notes) {
      response.json(notes);
      console.log("notes found");
    } else {
      response.status(404).send("Notes not found");
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Server error" });
  }
});

app.get("/notes/pages", async (request, response) => {
  try {
    loger(request);
    const startPage = parseInt(request.query._start_page) || 1;
    const endPage = parseInt(request.query._end_page) || startPage;
    const notesPerPage = parseInt(request.query._per_page) || 10;

    const notes = await Note.find()
      .skip((startPage - 1) * notesPerPage)
      .limit((endPage - startPage + 1) * notesPerPage);

    if (notes.length) {
      response.json(notes);
      console.log("notes found");
    } else {
      response.status(404).send("Notes not found");
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Server error" });
  }
});


app.get("/notes/total_notes", async (request, response) => {
  try {
    loger(request);
    console.log("Counting total notes...");
    const totalNotes = await Note.countDocuments({});
    console.log("Total notes:", totalNotes); 
    response.json(totalNotes);
  } catch (error) {
    console.error("Error counting notes:", error);
    response.status(500).json({ error: "Server error" });
  }
});

app.get("/notes/:id", async (request, response) => {
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

// Create a new note
app.post("/notes", async (request, response) => {
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

    const title = "Note " + (lastId + 1);
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

// put
app.put("/notes/:id", async (request, response) => {
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

// delete
app.delete("/notes/:id", async (request, response) => { 
  try {
    loger(request);
    const deletedNote = await Note.deleteOne({ id: request.params.id });

    if (deletedNote.deletedCount === 1) {
      response.status(204).json({ message: "Note deleted Successfully" });
    } else {
      response.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    console.log(error);
    response.status(400).json({ error: "Failed to delete note" });
  }
});
