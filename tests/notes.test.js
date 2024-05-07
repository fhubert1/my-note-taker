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

    // create mock request for get passing note_id
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      params: {note_id: noteId} 
    });
    // created mock response
    const res = httpMocks.createResponse();

    console.log('req params sent: ' + req.params.note_id);

    await notesRouter(req, res);

    // Check the response status and content type
    expect(res.statusCode).toBe(200);

    // Check the response body
    const note = res._getData();
    console.log("get res note: " + JSON.parse(note));

    expect(note.length).toBeGreaterThan(0);
    const jsonArray = JSON.parse(note);
    expect(jsonArray[0].id).toEqual(noteId);

  });

  // test case for deletion of test case 2
  it('DELETE /:note_id should delete a specific note', async () => {
    const noteId = '1';
    const notesData = [{ id: '1', title: 'Delete Me', text: 'Delete Me Text' }];

    // Mock the behavior of readFromFile and writeToFile
    //readFromFile.mockResolvedValue(JSON.stringify(notesData));
    readFromFile.mockResolvedValue(JSON.stringify(notesData));
    writeToFile.mockResolvedValue();

    // create mock request - method delete passing note_id to delete
    const req = httpMocks.createRequest({
      method: 'DELETE',
      url: `/${noteId}`,
    });

    // create mock request
    const res = httpMocks.createResponse();

    console.log('req params sent to be deleted: ' + req.params.note_id);

    // call method 
    const next = jest.fn();
    await notesRouter(req, res, next);

    expect(res.statusCode).toBe(200);

  });  

  // post new note into db
  it('POST / should add a new note', async () => {
    const newNote = { title: 'New Test Note', text: 'Test Note Content' };

    // Mock the behavior of readAndAppend
    readAndAppend.mockResolvedValue();

    // create mock request for post and pass new note in body
    const req = httpMocks.createRequest({
      method: 'post',
      url: '/',
      body: newNote
    });

    // create mock response
    const res = httpMocks.createResponse();

    // call method
    await notesRouter(req, res);

    // Check the response status and content
    expect(res.statusCode).toBe(200);
    const response = JSON.parse(res._getData());
    console.log('response: ' + response);
    expect(response).toEqual('Note added successfully');

  });
  

});    