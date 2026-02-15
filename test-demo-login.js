// Test demo admin login
import fetch from 'node-fetch';

async function testDemoLogin() {
  try {
    console.log('Testing demo admin login...');
    
    const response = await fetch('https://easy-travels-backend.onrender.com/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'demo@easytravels.com',
        password: 'demo123'
      })
    });
    
    console.log('Login response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Demo login successful!');
      console.log('Token:', data.token?.substring(0, 50) + '...');
      console.log('Admin:', data.admin);
    } else {
      const error = await response.json().catch(() => ({}));
      console.log('❌ Demo login failed:', error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDemoLogin();
