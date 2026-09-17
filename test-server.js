const http = require('http');
const fs = require('fs');
const path = require('path');

// Test 1: Fetch localhost:3000/
function testServer() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000/', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`[HTTP Test] Status: ${res.statusCode}, Body length: ${data.length}`);
        if (res.statusCode === 200 && data.includes('Mayank Yadav')) {
          console.log('✅ Server is serving index.html correctly.');
          resolve(true);
        } else {
          reject(new Error(`Unexpected response: ${res.statusCode}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

testServer()
  .then(() => console.log('HTTP Verification Passed.'))
  .catch((err) => {
    console.error('HTTP Test Error:', err);
    process.exit(1);
  });
