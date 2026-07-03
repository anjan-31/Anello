const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
let cloudName = '', apiKey = '', apiSecret = '';
envContent.split('\n').forEach(line => {
  if (line.trim().startsWith('CLOUDINARY_CLOUD_NAME=')) {
    cloudName = line.split('CLOUDINARY_CLOUD_NAME=')[1].trim();
  }
  if (line.trim().startsWith('CLOUDINARY_API_KEY=')) {
    apiKey = line.split('CLOUDINARY_API_KEY=')[1].trim();
  }
  if (line.trim().startsWith('CLOUDINARY_API_SECRET=')) {
    apiSecret = line.split('CLOUDINARY_API_SECRET=')[1].trim();
  }
});

console.log('Cloud:', cloudName, 'Key:', apiKey);
if (!cloudName || !apiKey || !apiSecret) {
  console.error('Missing credentials');
  process.exit(1);
}

const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image?max_results=100`, {
  headers: {
    Authorization: `Basic ${auth}`,
  },
})
  .then(res => res.json())
  .then(data => {
    console.log('Cloudinary Images:');
    if (data.resources) {
      console.log(JSON.stringify(data.resources.map(r => ({ public_id: r.public_id, url: r.secure_url })), null, 2));
    } else {
      console.log(data);
    }
  })
  .catch(err => console.error(err));
