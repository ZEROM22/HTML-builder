const fsPromises = require('fs/promises');
const path = require('path');

async function getFiles() {
  return fsPromises.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true });
}

async function main() {
  const dir = await getFiles();

  const promises = dir.map(async (file) => {
    const pathToFile = path.join(__dirname, 'secret-folder', file.name);
    const fileInfo = {
      name: file.name.substring(0, file.name.lastIndexOf('.')),
      extension: file.isDirectory() ? 'folder' : path.extname(file.name).slice(1),
    };

    const stats = await fsPromises.stat(pathToFile);
    fileInfo.size = (stats.size / 1024);
    return fileInfo;
  });

  const results = await Promise.all(promises);

  Array.prototype.forEach.call(results, (file) => {
    console.log(`${file.name} - ${file.extension} - ${file.size}kb`);
  });
}

main();
