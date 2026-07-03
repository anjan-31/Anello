const fs = require('fs');

if (fs.existsSync('homepage.html')) {
  const html = fs.readFileSync('homepage.html', 'utf8');
  console.log('HTML loaded. Length:', html.length);
  const bestsellersIndex = html.indexOf('bestsellers-section');
  if (bestsellersIndex !== -1) {
    console.log('Found "bestsellers-section" at index:', bestsellersIndex);
    // Print 1000 characters around it
    console.log('Context:', html.substring(bestsellersIndex - 100, bestsellersIndex + 1000));
  } else {
    console.log('Could NOT find "bestsellers-section" in homepage.html');
    // Let's search case insensitively
    const bestsellersLower = html.toLowerCase().indexOf('bestsellers');
    if (bestsellersLower !== -1) {
      console.log('Found "bestsellers" (case insensitive) at index:', bestsellersLower);
      console.log('Context:', html.substring(bestsellersLower - 100, bestsellersLower + 500));
    } else {
      console.log('Could NOT find "bestsellers" anywhere in homepage.html');
    }
  }
} else {
  console.log('homepage.html does not exist');
}
