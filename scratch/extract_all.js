const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\anjan\\.gemini\\antigravity-ide\\brain\\617aaf1b-23d4-45bd-bac0-abcb9a345e56\\.system_generated\\logs\\transcript.jsonl';

try {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.trim().split('\n');
  console.log(`Total lines in log: ${lines.length}`);
  lines.forEach((line, index) => {
    try {
      const obj = JSON.parse(line);
      console.log(`Line ${index + 1}: Index=${obj.step_index}, Source=${obj.source}, Type=${obj.type}, Length=${JSON.stringify(obj).length}`);
      if (obj.type === 'USER_INPUT') {
        console.log(`--- USER_INPUT CONTENT ---`);
        console.log(obj.content.substring(0, 500) + '...');
        console.log(`--- END ---`);
      }
    } catch (e) {
      console.error(`Error parsing line ${index + 1}:`, e.message);
    }
  });
} catch (err) {
  console.error('Error:', err);
}
