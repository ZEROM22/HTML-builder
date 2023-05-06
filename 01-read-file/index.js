const fs = require('fs');
const path = require('path');

const rs = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf8');

rs.on('data', (chunk) => {
  console.log(chunk);
});
