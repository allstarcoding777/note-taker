// dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

// read and write files asynchronously
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// set up server
const app = express();
const PORT = process.env.PORT || 3001;

// express.urlencoded is a method built into express that recognizes a Request Object as strings or arrays
// extended: true allows for objects to be passed in the URL
app.use(express.urlencoded({ extended: true }));
// express.json is a method built into express that recognizes Request Object as JSON
app.use(express.json());

// middleware to access static files, such as stylesheet
app.use(express.static('./develop/public'));

// GET route to return notes.html
app.get('api/notes', function(req, res) {
    // readFileAsync reads the db.json file, then returns the data
    readFileAsync('db/db.json', 'utf8').then(function(data) {
        // parse the data, concat is used to convert the data into an array
        notes = [].concat(JSON.parse(data));
        // return the notes array
        res.json(notes);
    })
    });

// POST route to add new note to db.json
app.post('/api/notes', function(req, res) {
    // newNote is the new note that will be added to the notes array that already exists in db.json
    const newNote = req.body;
    // reads the db.json file, then returns the data
    readFileAsync('./develop/db/db.json', 'utf8').then(function(data) {
        // notes is the array that already exists in db.json
        // parse the data and concatentate it to the notes array
        const notes = [].concat(JSON.parse(data));
        // assign an id to the new note
        newNote.id = notes.length + 1;
        // push the new note to the notes array and return the notes array
        notes.push(newNote);
        return notes
        // then write the new notes array to the db.json file
    }).then(function(notes) {
        writeFileAsync('./develop/db/db.json', JSON.stringify(notes));
        res.json(newNote);
    })
});

// DELETE route to delete note from db.json
// id is used to identify the note to be deleted
app.delete('/api/notes/:id', function(req, res) {
    // parseInt converts the id to an integer, req.params.id is the id of the note to be deleted 
    const deleteNote = parseInt(req.params.id);
    // reads the db.json file, then returns the data
    readFileAsync('./develop/db/db.json', 'utf8').then(function(data) {
        // parse and concatenate the data to the notes array
        const notes = [].concat(JSON.parse(data));
        const updatedNotes = []
        // find all notes that we do not want to delete and push them to the newNotes array
        for (let i = 0; i < notes.length; i++) {
            if (deleteNote !== notes[i].id) {
                updatedNotes.push(notes[i]);
            }
        }
        // return the updatedNotes array, then write the updatedNotes array to the db.json file
        return updatedNotes;
    }).then(function(notes) {
        writeFileAsync('./develop/db/db.json', JSON.stringify(notes));
        res.send('Note deleted');
    })
});

// HTML routes to return index.html and notes.html
// sendFile sends the file to the browser, path.join joins the current directory with the path to the file
app.get('/notes', function(req, res) {
    res.sendFile(path.join(__dirname, './develop/public/notes.html'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './develop/public/index.html'));
});
// the asterisk allows us to type anything into the URL and still return us to the homepage
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, './develop/public/index.html'));
});

// listen on PORT
app.listen(PORT, function() {
    console.log(`app listening on PORT ${PORT}`);
});

