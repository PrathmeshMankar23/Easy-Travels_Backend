// Test script for backend review API
const http = require('http');

const API_URL = 'http://localhost:3000/api';

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    req.write(options.body || '');
    req.end();
  });
}

async function testReviewAPI() {
  try {
    console.log('Testing Backend Review API...');
    
    // Test submitting a review
    const reviewData = {
      name: 'Test User',
      email: 'test@example.com',
      rating: 5,
      review: 'This is a test review from the backend test script'
    };

    console.log('Submitting review:', reviewData);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/reviews',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData)
    };

    const response = await makeRequest(options);
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    if (response.status !== 201) {
      console.error('Failed to submit review');
      return;
    }

    console.log('✅ Success! Review submitted successfully');

    // Test getting approved reviews
    console.log('\nTesting get approved reviews...');
    const getOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/reviews/approved',
      method: 'GET'
    };

    const approvedResponse = await makeRequest(getOptions);
    console.log('Approved reviews status:', approvedResponse.status);
    console.log('Approved reviews data:', approvedResponse.data);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testReviewAPI();
