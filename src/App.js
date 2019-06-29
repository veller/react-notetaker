import React, { useState, useEffect } from "react";
import uuid from "uuid";
import ReactMarkdown from "react-markdown";
import moment from "moment";

function Note({
  text,
  id,
  createdAt,
  editedAt,
  handleEditNote,
  handleDeleteNote
}) {
  const [isEditing, setEditing] = useState(false);
  const [newNoteText, setNewNoteText] = useState(text);

  const handleNoteTextChange = (newNoteText, id) => {
    handleEditNote(newNoteText, id);
    setEditing(false);
  };

  return (
    <div onClick={() => setEditing(true)} className="note">
      {isEditing ? (
        <div>
          <textarea
            autoFocus
            type="text"
            value={newNoteText}
            onChange={e => setNewNoteText(e.target.value)}
            onBlur={() => handleNoteTextChange(newNoteText, id)}
            cols="300"
            rows="5"
            className="note--is-editing"
          />
        </div>
      ) : (
        <div className="note--is-not-editing">
          <span>
            {editedAt ? `edited ` : `created `}
            {moment(editedAt || createdAt).fromNow()}
          </span>

          <ReactMarkdown source={newNoteText} />
          <div
            onClick={() => handleDeleteNote(id)}
            className="note--is-not-editing__delete-button"
          >
            <i className="fas fa-times" />
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [notes, setNotes] = useState(
    JSON.parse(localStorage.getItem("noteTaker"))
  );

  useEffect(() => {
    localStorage.setItem("noteTaker", JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = () => {
    const newNote = {
      id: uuid(),
      text: "New note. Click to edit me.",
      createdAt: new Date(),
      editedAt: null
    };
    setNotes([...notes, newNote]);
  };

  const handleEditNote = (newNoteText, id) => {
    const updatedNotes = [...notes];
    updatedNotes.map(note => {
      if (note.id === id) {
        note.text = newNoteText.replace("\\n", "\n");
        note.editedAt = new Date();
      }
      return note;
    });
    setNotes(updatedNotes);
  };

  const handleDeleteNote = id => {
    const filteredNotes = notes.filter(note => note.id !== id);
    setNotes(filteredNotes);
  };

  const sortByMostRecentlyCreated = array =>
    array.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <>
      <div className="header">
        <h1 className="header__title">React note taker</h1>
        <button className="header__button" onClick={handleAddNote}>
          <i className="fas fa-feather" /> Add a new note
        </button>
      </div>
      <div className="container">
        {sortByMostRecentlyCreated(notes).map(note => (
          <Note
            {...note}
            key={note.id}
            handleEditNote={handleEditNote}
            handleDeleteNote={handleDeleteNote}
          />
        ))}
      </div>
    </>
  );
}

export default App;
