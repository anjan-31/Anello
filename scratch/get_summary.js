const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\anjan\\.gemini\\antigravity-ide\\brain\\617aaf1b-23d4-45bd-bac0-abcb9a345e56\\.system_generated\\logs\\transcript.jsonl';

try {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.trim().split('\n');
  
  lines.forEach((line, index) => {
    const obj = JSON.parse(line);
    if (obj.type === 'USER_INPUT') {
      console.log(`\n[Step ${obj.step_index}] USER INPUT`);
    } else if (obj.tool_calls) {
      obj.tool_calls.forEach(tc => {
        console.log(`[Step ${obj.step_index}] TOOL: ${tc.name} -> ${JSON.stringify(tc.args)}`);
      });
    }
  });
} catch (err) {
  console.error('Error:', err);
}
