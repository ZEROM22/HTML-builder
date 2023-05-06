const fs = require('fs');
const path = require('path');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

fs.appendFile(path.join(__dirname, 'output.txt'), '', () => {});
const ws = fs.createWriteStream(path.join(__dirname, 'output.txt'), 'utf8');

const rl = readline.createInterface({ input, output });

rl.on('line', (str) => {
  if (str === 'exit') process.exit();
  ws.write(`${str}\r\n`);
});

const exit = () => {
  console.log('Процесс завершен...');
  rl.pause();
};

process.on('exit', exit);

console.log('Введите текст. Для выхода нажмите Ctrl + C или введите exit');
