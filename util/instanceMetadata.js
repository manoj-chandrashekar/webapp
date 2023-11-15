// instanceMetadata.js
const http = require('http');

function fetchInstanceIP() {
  return new Promise((resolve, reject) => {
    const options = {
      host: '169.254.169.254',
      path: '/latest/meta-data/local-ipv4',
      timeout: 5000,
      headers: {
        "Metadata-Flavor": "aws4_request"
      }
    };

    http.get(options, (res) => {
      if (res.statusCode !== 200) {
        reject(`Failed to fetch IP. Status Code: ${res.statusCode}`);
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', (e) => {
      reject(`Error fetching IP: ${e.message}`);
    });
  });
}

module.exports = { fetchInstanceIP };
