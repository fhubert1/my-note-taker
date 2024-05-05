const app = require('../routes/notes');
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');

// Mock Express request and response objects
const request = require('supertest');
jest.mock('../helpers/fsUtils'); // Mock the fsUtils module

describe('Notes Router', () => {
  it('responds with JSON containing notes data', (done) => {
    // Mock the behavior of readFromFile
    readFromFile.mockResolvedValue(JSON.stringify([{ id: '1', title: 'Note 1', text: 'Content of Note 1' }]));

    request(app)
      .get('/api/notes')
      .expect('Content-Type', /json/)
      .expect(200, done)
      .end((err, res) => {
        if (err) return done(err);
      
        // Add your assertions here to check the response body
        const notes = res.json();
        console.log(notes);
        expect(notes.length).toBeGreaterThan(0);
        expect(notes[0]).toHaveProperty('id');
        expect(notes[0]).toHaveProperty('title');
        expect(notes[0]).toHaveProperty('text');
        done();
    });
  });


  // it('responds with JSON containing a specific note', (done) => {
  //   const noteId = '1'; // Provide a valid note ID from your test data
  //   request(notes)
  //     .get(`/${noteId}`)
  //     .expect('Content-Type', /json/)
  //     .expect(200, done);
  //     // .end((err, res) => {
  //     //   if (err) return done(err);
  //     //   // Add your assertions here to check the response body
  //     //   // For example:
  //     //   const note = res.json();
  //     //   expect(note.id).toBe(noteId);
  //     //   // Add more assertions as needed based on your response structure
  //     //   done();
  //     });
  // });  
});    