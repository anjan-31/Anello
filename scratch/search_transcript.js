const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'transcript_readable.txt');

try {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Let's split by === STEP and print the step header and content for all model steps
  const steps = content.split('=== STEP ');
  steps.forEach(step => {
    if (step.includes('PLANNER_RESPONSE')) {
      const firstLine = step.split('\n')[0];
      console.log(`=== STEP ${firstLine}`);
      const contentIndex = step.indexOf('Content:\n');
      if (contentIndex !== -1) {
        let contentText = step.substring(contentIndex + 9);
        const endDivider = contentText.indexOf('==================================================');
        if (endDivider !== -1) {
          contentText = contentText.substring(0, endDivider);
        }
        console.log(contentText.trim().substring(0, 500) + '...\n');
      }
    }
  });
} catch (err) {
  console.error('Error:', err);
}
