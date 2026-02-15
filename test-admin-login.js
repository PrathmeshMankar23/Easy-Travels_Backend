// Test admin@easytravels.com login with common passwords
import fetch from 'node-fetch';

async function testAdminLogin() {
  const passwords = ['admin123', 'password', '123456', 'admin'];
  
  for (const password of passwords) {
    try {
      console.log(`Testing admin@easytravels.com with password: ${password}`);
      
      const response = await fetch('https://easy-travels-backend.onrender.com/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@easytravels.com',
          password: password
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ LOGIN SUCCESSFUL!');
        console.log('Password:', password);
        console.log('Token:', data.token?.substring(0, 50) + '...');
        return; // Stop testing on success
      } else {
        const error = await response.json().catch(() => ({}));
        console.log('❌ Failed:', error.message);
      }
      
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
    
    console.log('---');
  }
}

testAdminLogin();
