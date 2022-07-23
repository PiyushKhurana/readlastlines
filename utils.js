const fsAsync = require("fs/promises");
const fs = require("fs");

module.exports = {
  readLastNLines: async function readLastNLines(filePath, N) {
    const newLineChar = "\n";
    const [fileStat, fileHandle] = await Promise.all([
      fsAsync.stat(filePath),
      fsAsync.open(filePath, "r"),
    ]);
    let charReadCount = 0;
    let lineCount = 0;
    let linesStr = "";

    while (true) {
      if (linesStr.length === fileStat.size || lineCount === N) {
        if (linesStr[0] === newLineChar) {
          linesStr = linesStr.slice(1);
        }
        fileHandle.close();
        return Buffer.from(linesStr, "binary").toString();
      }

      const nextChar = await readPrecedingChar(
        fileStat,
        fileHandle.fd,
        charReadCount
      );

      linesStr = nextChar + linesStr;
      if (nextChar === newLineChar) {
        lineCount++;
      }
      charReadCount++;
    }
  },
  getFileStats: function (filePath) {
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (err, stat) => {
        if (err) reject(err);

        resolve(stat);
      });
    });
  },
};

function readPrecedingChar(stat, fd, charReadCount) {
  return new Promise((resolve, reject) => {
    fs.read(
      fd,
      Buffer.alloc(1),
      0,
      1,
      stat.size - 1 - charReadCount,
      (err, _bytesRead, buffer) => {
        if (err) reject(err);
        resolve(String.fromCharCode(buffer[0]));
      }
    );
  });
}
