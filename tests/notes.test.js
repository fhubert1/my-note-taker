const notesRouter = require('../routes/notes');
const httpMocks = require('node-mocks-http');
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');

// Mock Express request and response objects
jest.mock('../helpers/fsUtils'); // Mock the fsUtils module

describe('Notes Router', () => {

  // test case to test note id 1 is in db
  it('GET /:note_id should respond with a specific note', async () => {

    const noteId = '1';
    const notesData = [{ id: '1', title: 'Test Title', text: 'Test text' }];

    // Mock the behavior of readFromFile
    readFromFile.mockResolvedValue(JSON.stringify(notesData));

    const req = httpMocks.createRequest({
      method: 'get',
      url: '/',
      params: { note_id: noteId }
    });
    const res = httpMocks.createResponse();

    await notesRouter(req, res);

    // Check the response status and content type
    expect(res.statusCode).toBe(200);

    // Check the response body
    const note = JSON.parse(res._getData());
    expect(note.length).toBeGreaterThan(0);
    expect(note[0]).toHaveProperty('id', noteId);
  });

  // test case for deletion of test case 2
  it('DELETE /:note_id should delete a specific note', async () => {
    const noteId = '2';
    const notesData = [{ id: '2', title: 'Delete Me', text: 'Delete Me Text' }];

    // Mock the behavior of writing record to db
    readAndAppend.mockResolvedValue(notesData, './db/notes.json');
    //writeToFile.mockResolvedValue(JSON.stringify(notesData));

    const req = httpMocks.createRequest({
      method: 'delete',
      url: '/',
      params: { note_id: noteId }
    });

    const res = httpMocks.createResponse();

    await notesRouter(req, res);

    // Check the response status and content
    expect(res.statusCode).toBe(200);
    const response = JSON.parse(res._getData());
    expect(response).toEqual(`Item ${noteId} has been deleted 🗑️`);
  });  

  // post new note into db
  it('POST / should add a new note', async () => {
    const newNote = { title: 'New Test Note', text: 'Test Note Content' };

    // Mock the behavior of readAndAppend
    readAndAppend.mockResolvedValue();

    const req = httpMocks.createRequest({
      method: 'post',
      url: '/',
      body: newNote
    });
    const res = httpMocks.createResponse();

    await notesRouter(req, res);

    // Check the response status and content
    expect(res.statusCode).toBe(200);
    const response = JSON.parse(res._getData());
    console.log('response: ' + response);
    expect(response).toEqual('Note added successfully');
  });
  

});    