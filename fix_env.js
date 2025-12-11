const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, 'client', '.env');
const content = 'VITE_API_URL=http://localhost:5000\n';

fs.writeFileSync(envPath, content, { encoding: 'utf8' });
console.log('Fixed .env file at ' + envPath);
