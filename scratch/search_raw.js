const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\anjan\\.gemini\\antigravity-ide\\brain\\617aaf1b-23d4-45bd-bac0-abcb9a345e56\\.system_generated\\logs\\transcript.jsonl';

try {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.trim().split('\n');
  
  lines.forEach((line, index) => {
    const obj = JSON.parse(line);
    if (obj.content && obj.content.trim() !== '') {
      console.log(`Step ${obj.step_index} (${obj.source} - ${obj.type}) content (first 200 chars):`);
      console.log(obj.content.substring(0, 200).replace(/\n/g, ' ') + '...');
      console.log('-'.repeat(30));
    }
  });
} catch (err) {
  console.error('Error:', err);
}
