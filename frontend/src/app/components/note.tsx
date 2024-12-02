import styles from "../page.module.css";
import { useState } from "react";

interface Note {
    _id: number;
    id: number;
    title: string;
    author: {
      name: string;
      email: string;
    } | null;
    content: string;
  }

  
  interface NoteProps {
    note: Note;
    putNote: (id: number, content: string) => void;
    deleteNote: (id: number) => void;
    user: string;
  }
  
// How the note will look
const Note: React.FC<NoteProps> = ({ note, putNote, deleteNote, user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [noteContent, setNoteContent] = useState(note.content);
    return (
       <div className="note" id={String(note._id)}>
      <div className={styles.noteHeader}>
        <h1>{note.title}</h1>
        <p>Author: {note.author? note.author.name : 'Unknown'}</p>
        <p>Email: {note.author? note.author.email : 'Unknown'}</p>
      </div>
      <div className={styles.noteContent}>
        {isEditing? (
          <div>
            <input type="text" name={"text_input-" + note.id} value= {noteContent} onChange ={(e) => setNoteContent(e.target.value)}/>
            <button className={styles.button} name={"text_input_save-" + note.id} onClick= {() => {putNote(note.id, noteContent); console.log(noteContent); setIsEditing(false)}}>
              Save
            </button>
            <button className={styles.button} name={"text_input_cancel-" + note.id} onClick= {() => {setIsEditing(false)}}>
              Cancel
            </button>
        </div>
        ) : (
        <p>{note.content}</p>
      )}
      {user === note.author?.name && (
    <div>
      <button className={styles.button} name={"edit-" + note.id} onClick={() => setIsEditing(!isEditing)}>
        Edit
      </button>
      <button className={styles.button} name={"delete-" + note.id} onClick={() => deleteNote(note.id)}>
        Delete
      </button>
    </div>
    )}
    </div>
  </div>
    )
  };

export default Note;



