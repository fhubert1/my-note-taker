const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');

const { readFromFile, readAndAppend, writeToFile, } = require('../helpers/fsUtils');

notes.get('/', (req, res) => {
    //console.log("get /");
    readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
  });

// GET Route for a specific note
notes.get('/:note_id', (req, res) => {
  console.log("calling get");
    const noteId = req.params.note_id;

    readFromFile('./db/notes.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        const result = json.filter((note) => note.id === noteId);
        return result.length > 0
          ? res.json(result)
          : res.json('No note with that ID');
      });
  });  

// DELETE Route for a specific note
notes.delete('/:note_id', (req, res) => {
  console.log("calling delete");
    const noteId = req.params.note_id;
    readFromFile('./db/notes.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        // Make a new array of all tips except the one with the ID provided in the URL
        console.log("filter id is: " + json);
        const result = json.filter((note) => note.id !== noteId);
  
        // Save that array to the filesystem
        writeToFile('./db/notes.json', result);
  
        // Respond to the DELETE request
        res.json(`Item ${noteId} has been deleted 🗑️`);
      });
  });

// POST Route for a new UX/UI tip
notes.post('/', (req, res) => {

    console.log(req.body);
  
    const { title, text } = req.body;
    // if body passed create new note
    if (req.body) {
      const newNote = {
        id: uuidv4(),
        title,
        text,
      };
  
      // 
      readAndAppend(newNote, './db/notes.json');
      res.json(`Note added successfully`);
    } else {
      res.error('Error in adding note');
    }
  });
  
  module.exports = notes;
  