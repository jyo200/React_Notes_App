// Notes.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notes.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/notes').then((response) => {
      setNotes(response.data);
    });
  }, []);

  const addNote = () => {
    axios
      .post('http://localhost:5000/notes', {
        title: newTitle,
        content: newNote,
        date: newDate,
      })
      .then((response) => {
        setNotes([...notes, response.data]);
        setNewTitle('');
        setNewNote('');
        setNewDate('');
      });
  };

  const deleteNote = (id) => {
    axios.delete(`http://localhost:5000/notes/${id}`).then(() => {
      const updatedNotes = notes.filter((note) => note.id !== id);
      setNotes(updatedNotes);
    });
  };

  const updateNote = (id) => {
    axios
      .put(`http://localhost:5000/notes/${id}`, { content: editedContent })
      .then(() => {
        const updatedNotes = [...notes];
        const noteIndex = updatedNotes.findIndex((note) => note.id === id);
        updatedNotes[noteIndex].content = editedContent;
        setNotes(updatedNotes);
        setEditMode(null);
      });
  };



const filteredNotes = searchTerm
  ? notes.filter((note) =>
      note.title &&
      note.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : notes;

// ...


  return (
    <div className="notes-container">
      <h1 style={{color:"white"}}>Notes</h1>
      <div className="add-note">
        <input
          type="text"
          placeholder="Title..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Note content..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <button onClick={addNote}>Add</button>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="notes-list">
        {filteredNotes.map((note) => (
          <div key={note.id} className="note">
            <div className="note-content">
              <h3>{note.title}</h3>
              {editMode === note.id ? (
                <div>
                  <input
                    type="text"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <button onClick={() => updateNote(note.id)}>
                    <FontAwesomeIcon icon={faSave} />
                  </button>
                </div>
              ) : (
                <p>{note.content}</p>
              )}
            </div>
            <div className="note-date">{note.date}</div>
            <div className="note-actions">
              {editMode !== note.id ? (
                <button onClick={() => setEditMode(note.id)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              ) : null}
              <button className="delete-button" onClick={() => deleteNote(note.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;
