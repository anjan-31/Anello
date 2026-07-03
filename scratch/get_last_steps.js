const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\anjan\\.gemini\\antigravity-ide\\brain\\617aaf1b-23d4-45bd-bac0-abcb9a345e56\\.system_generated\\logs\\transcript.jsonl';

try {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.trim().split('\n');
  const lastLines = lines.slice(-5);
  
  lastLines.forEach((line, idx) => {
    const obj = JSON.parse(line);
    console.log(`=== LAST LINE ${idx + 1} (Step ${obj.step_index}, Source=${obj.source}, Type=${obj.type}) ===`);
    if (obj.content) {
      console.log(obj.content);
    }
    if (obj.tool_calls) {
      console.log(JSON.stringify(obj.tool_calls, null, 2));
    }
    console.log('-'.repeat(40));
  });
} catch (err) {
  console.error('Error:', err);
}
