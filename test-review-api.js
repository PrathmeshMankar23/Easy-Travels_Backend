// Test script for review API
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api';

async function testReviewAPI() {
  try {
    console.log('Testing Review API...');
    
    // Test submitting a review
    const reviewData = {
      name: 'Test User',
      email: 'test@example.com',
      rating: 5,
      review: 'This is a test review from the API test script'
    };

    console.log('Submitting review:', reviewData);
    
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }

    const result = await response.json();
    console.log('Success! Review submitted:', result);

    // Test getting approved reviews
    console.log('\nTesting get approved reviews...');
    const approvedResponse = await fetch(`${API_URL}/reviews/approved`);
    const approvedReviews = await approvedResponse.json();
    console.log('Approved reviews:', approvedReviews);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testReviewAPI();
