import React, { useState } from 'react';
import styles from "../page.module.css";

const AddNewNoteInput: React.FC<{
  onAddNote: (content: string) => void;
  onCancel: () => void;}> = (
    { onAddNote, onCancel }) => {
  const [content, setContent] = useState('');

  const handleSaveNote = () => {
    onAddNote(content);
    setContent('');
    onCancel();
  };

  const handleCancel = () => {
    onCancel(); 
  };

  return (
    <div className={styles.addNewNote}>
        <div className={styles.textInputContainer}>
          <label>
          Content:
          <input name='text_input_new_note' type="text" value={content} onChange ={(e) => setContent(e.target.value)}/>
        </label>
          <button className={styles.button} name="text_input_save_new_note" onClick={handleSaveNote}>
            Save
          </button>
          <button className={styles.button} name="text_input_cancel_new_note" onClick={handleCancel}>
            Cancel
          </button>
        </div>
    </div>
  );
};

export default AddNewNoteInput;