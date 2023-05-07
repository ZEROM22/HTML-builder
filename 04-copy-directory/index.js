const fsPromises = require('fs/promises');
const path = require('path');

async function main() {
  await fsPromises.mkdir(path.join(__dirname, 'files-copy'), { recursive: true });

  const dir = await fsPromises.readdir(path.join(__dirname, 'files'));
  const promises = dir.map(async (file) => {
    await fsPromises.copyFile((path.join(__dirname, 'files', file)), (path.join(__dirname, 'files-copy', file)));
  });

  await Promise.all(promises);
}

main();
