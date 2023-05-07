const fs = require('fs');
const fsPromises = require('fs/promises');

const path = require('path');

const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');
fs.appendFile(pathToBundle, '', () => {});
const ws = fs.createWriteStream(pathToBundle, 'utf8');

async function main() {
  const dir = await fsPromises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
  const rules = [];

  Array.prototype.forEach.call(dir, (file) => {
    if (file.isFile() && path.extname(file.name).slice(1) === 'css') {
      const rs = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
      rules.push(new Promise((resolve, reject) => {
        rs.on('error', reject);
        rs.on('end', resolve);
        rs.pipe(ws, { end: false });
      }));
    }
  });

  await Promise.all(rules);
  ws.end();
}

main();
