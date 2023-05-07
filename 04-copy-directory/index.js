const fsPromises = require('fs/promises');
const path = require('path');

async function getFiles() {
  return fsPromises.readdir(path.join(__dirname, 'files'));
}

async function main() {
  await fsPromises.mkdir(path.join(__dirname, 'files-copy'), { recursive: true });

  const dir = await getFiles();
  const promises = dir.map(async (file) => {
    await fsPromises.copyFile((path.join(__dirname, 'files', file)), (path.join(__dirname, 'files-copy', file)));
  });

  await Promise.all(promises);
}

main();
