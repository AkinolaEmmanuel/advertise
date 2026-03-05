const http = require('http');

console.log('--- Starting Platform Seed ---');
console.log('Contacting API at http://localhost:4000/api/seed...');

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/seed',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('Success: Platform seeded successfully!');
      try {
        const parsed = JSON.parse(data);
        console.log('\nCreated Accounts:');
        parsed.accounts.forEach(acc => {
          console.log(`- ${acc.email}: ${acc.status}`);
        });
        console.log('\nFull Credentials:');
        console.table(parsed.credentials);
      } catch (e) {
        console.log('Seed response received but could not be parsed.');
      }
    } else {
      console.error(`Error: Seed failed with status ${res.statusCode}`);
      console.log('Response:', data);
      console.log('\nMake sure your dev server (npm run dev) is running!');
    }
  });
});

req.on('error', (error) => {
  console.error('\nError: Could not connect to the server.');
  console.error('>> Make sure you have run "npm run dev" in another terminal first!');
  console.error('>> Detail:', error.message);
});

req.end();
