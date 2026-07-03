const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\anjan\\.gemini\\antigravity-ide\\brain\\617aaf1b-23d4-45bd-bac0-abcb9a345e56\\.system_generated\\logs\\transcript.jsonl';
const outputPath = path.join(__dirname, 'full_prompt.txt');

try {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  if (lines.length > 0) {
    const firstLine = JSON.parse(lines[0]);
    fs.writeFileSync(outputPath, firstLine.content, 'utf8');
    console.log('Successfully extracted prompt to full_prompt.txt');
  } else {
    console.log('No lines found in transcript.jsonl');
  }
} catch (err) {
  console.error('Error:', err);
}
