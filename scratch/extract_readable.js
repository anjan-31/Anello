const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\anjan\\.gemini\\antigravity-ide\\brain\\617aaf1b-23d4-45bd-bac0-abcb9a345e56\\.system_generated\\logs\\transcript.jsonl';
const outputPath = path.join(__dirname, 'transcript_readable.txt');

try {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.trim().split('\n');
  let output = '';

  lines.forEach((line, index) => {
    try {
      const obj = JSON.parse(line);
      output += `=== STEP ${obj.step_index} (${obj.source} - ${obj.type}) ===\n`;
      if (obj.content) {
        output += `Content:\n${obj.content}\n`;
      }
      if (obj.tool_calls) {
        output += `Tool Calls:\n${JSON.stringify(obj.tool_calls, null, 2)}\n`;
      }
      output += '\n' + '='.repeat(50) + '\n\n';
    } catch (e) {
      output += `[Error parsing line ${index + 1}: ${e.message}]\n\n`;
    }
  });

  fs.writeFileSync(outputPath, output, 'utf8');
  console.log('Successfully wrote readable transcript to transcript_readable.txt');
} catch (err) {
  console.error('Error:', err);
}
