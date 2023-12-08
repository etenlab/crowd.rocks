import path from 'path';
import { fileURLToPath } from 'url';

// Define the base directory for test data
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseTestDataDirectory = path.join(__dirname, '../testData/');

// Define the constants
const constants = {
  filePath: (documentName: string) =>
    path.join(baseTestDataDirectory, documentName),
  invalidFile: path.join(baseTestDataDirectory, 'gifSample.gif'),
  fileContent: 'Hello, this is the content of the file.',
};

export default constants;
