const fs = require('fs');

// Define the path to the /etc/environment file
const environmentFilePath = '/etc/environment';

// Read the /etc/environment file and set the environment variables
try {
  const data = fs.readFileSync(environmentFilePath, 'utf8');
  const lines = data.split('\n');
  lines.forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key] = value;
    }
  });
} catch (err) {
  console.error('Error reading environment file:', err);
}

// Now you can access environment variables in your Node.js application
const dbUsername = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

// Use the variables in your application
console.log('DB_USERNAME:', dbUsername);
console.log('DB_PASSWORD:', dbPassword);
