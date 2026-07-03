const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\anjan\\.gemini\\antigravity-ide\\brain\\822448da-4c67-41af-a151-3aafd7d528af\\.system_generated\\tasks\\task-131.log';

try {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.trim().split('\n');
  console.log(`Last 30 lines of task-131.log (total ${lines.length} lines):`);
  console.log(lines.slice(-30).join('\n'));
} catch (err) {
  console.error('Error:', err);
}
