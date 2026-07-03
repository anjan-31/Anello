const http = require('http');

http.get('http://localhost:4000/api/products', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    try {
      const parsed = JSON.parse(data);
      console.log('Fetched products length:', parsed.length);
      if (Array.isArray(parsed)) {
        console.log('First product:', parsed[0]);
      } else {
        console.log('Response is not an array:', parsed);
      }
    } catch (e) {
      console.log('Failed to parse JSON:', e.message);
      console.log('Raw data (first 500 chars):', data.substring(0, 500));
    }
  });
}).on('error', (err) => {
  console.error('Error fetching API:', err.message);
});
