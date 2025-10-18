import DataUriParser from 'datauri/parser.js';
import path from 'path';

//To convert a file's buffer (raw data) into a Base64 data URI string using its file extension.
const getBuffer = (file: any) => {
  const parser = new DataUriParser();
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};

export default getBuffer;
