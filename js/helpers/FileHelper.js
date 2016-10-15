import fs from 'fs';
import path from 'path';

export default class FileHelper {
  static ensureExistence(filePath) {
    let dirName = path.dirname(filePath);
    try {
      fs.statSync(filePath).isFile();
    } catch (ignore) {
      if (this.ensureDir(dirName)) fs.writeFileSync(filePath, '');
    }
    return filePath
  }

  static ensureDir(dirPath) {
    try {
      fs.statSync(dirPath).isDirectory();
    }
    catch (ignore) {
      if (this.ensureDir(path.dirname(dirPath))) fs.mkdirSync(dirPath);
    }
    return true;
  }
}