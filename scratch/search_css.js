const fs = require('fs');
const css = fs.readFileSync('src/app/globals.css', 'utf8');
const lines = css.split('\n');

console.log('Searching in globals.css...');
lines.forEach((line, idx) => {
  if (line.includes('stylish-') || line.includes('bestsellers-')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
