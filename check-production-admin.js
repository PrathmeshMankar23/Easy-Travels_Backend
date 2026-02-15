// Test script to check production backend admin status
import fetch from 'node-fetch';

async function testProductionAuth() {
  try {
    console.log('Testing production backend health...');
    
    // Test health endpoint
    const healthResponse = await fetch('https://easy-travels-backend.onrender.com/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test login endpoint
    console.log('\nTesting login endpoint...');
    const loginResponse = await fetch('https://easy-travels-backend.onrender.com/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'admin@easytravels.com', 
        password: 'admin123' 
      })
    });
    
    console.log('Login response status:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful:', loginData);
    } else {
      const errorData = await loginResponse.json().catch(() => ({}));
      console.log('❌ Login failed:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testProductionAuth();
