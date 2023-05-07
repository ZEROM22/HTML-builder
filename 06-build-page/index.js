const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

async function buildHTML() {
  await fsPromises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });

  const pathToBuild = path.join(__dirname, 'project-dist', 'index.html');
  fs.appendFile(pathToBuild, '', () => {});
  const ws = fs.createWriteStream(pathToBuild, 'utf8');

  let template = await fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf8');

  const componentsDir = await fsPromises.readdir(path.join(__dirname, 'components'), { withFileTypes: true });
  const components = await Promise.all(componentsDir.map(async (file) => {
    const componentName = file.name.substring(0, file.name.lastIndexOf('.'));
    const componentData = await fsPromises.readFile(path.join(__dirname, 'components', file.name), 'utf8');
    return { name: componentName, data: componentData };
  }));

  Array.prototype.forEach.call(components, (component) => {
    template = template.replace(`{{${component.name}}}`, component.data);
  });

  ws.write(template);
}

async function buildStyle() {
  const pathToBuild = path.join(__dirname, 'project-dist', 'style.css');
  fs.appendFile(pathToBuild, '', () => {});
  const ws = fs.createWriteStream(pathToBuild, 'utf8');

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

async function copyAssets() {
  await fsPromises.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true });

  async function copyFiles(pathToFiles) {
    const files = await fsPromises.readdir(pathToFiles, { withFileTypes: true });

    const promises = files.map(async (file) => {
      if (file.isDirectory()) {
        await fsPromises.mkdir(path.join(__dirname, 'project-dist', pathToFiles.substring(pathToFiles.lastIndexOf('\\')), file.name), { recursive: true });
        copyFiles(path.join(pathToFiles, file.name));
      } else {
        fsPromises.copyFile((path.join(pathToFiles, file.name)), (path.join(__dirname, 'project-dist', 'assets', pathToFiles.substring(pathToFiles.lastIndexOf('\\')), file.name)));
      }
    });

    await Promise.all(promises);
  }

  copyFiles(path.join(__dirname, 'assets'));
}

buildHTML();
buildStyle();
copyAssets();
