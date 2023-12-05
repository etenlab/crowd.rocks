import path from 'path';

// Define the base directory for test data
const baseTestDataDirectory =
  'D:/Etenlabs/Repos/Latest/crowd.rocks/frontend/tests/testData/';

// Define the constants
const constants = {
  filePath: (documentName: string) =>
    path.join(baseTestDataDirectory, documentName),
  invalidFile: path.join(baseTestDataDirectory, 'gifSample.gif'),
  fileContent: 'Hello, this is the content of the file.',
};

export default constants;
