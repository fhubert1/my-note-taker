const notes = require('../routes/notes');
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');

// Mock dependencies
jest.mock('../helpers/fsUtils');

// Mock Express request and response objects
const { mockReq, mockRes } = require('jest-express');

describe('Notes Router', () => {
    beforeEach(() => {
      // Clear any mock calls before each test
      jest.clearAllMocks();
    });

    test('GET / returns all notes', async () => {


      //const req = mockReq({method: 'GET', url: '/'});
      const req = mockReq();
      const res = mockRes();
    
      const mockData = [{ id: '1', title: 'Test Title', text: 'Test text' }];
      readFromFile.mockResolvedValue(JSON.stringify(mockData));
        
      //await notes(req, res);
      await notes.get('/', req, res);

    
      expect(res.json).toHaveBeenCalledWith(mockNotesData);
    });   
              

});    