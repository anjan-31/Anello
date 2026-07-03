const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'homepage.html');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove the tag bar wrap
  content = content.replace(/<div class="home-tag-bar-wrap">[\s\S]*?<\/div>\s*<\/div>/g, '');

  // Remove the overlay tags
  content = content.replace(/<div class="insta-tag">[\s\S]*?<\/div>/g, '');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully cleaned homepage.html!');
} else {
  console.log('homepage.html not found.');
}
