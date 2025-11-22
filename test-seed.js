import fetch from 'node-fetch';

async function testSeed() {
  try {
    console.log('Calling seed endpoint...');
    const response = await fetch('http://localhost:5000/api/seed-porpoise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSeed();
