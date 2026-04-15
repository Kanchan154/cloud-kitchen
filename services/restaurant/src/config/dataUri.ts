import DataUriParser from "datauri/parser.js";
import path from 'path'

const getBuffer = (file: any) => {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toLowerCase();
    const buffer = parser.format(extName, file.buffer);
    return buffer;
}

export default getBuffer