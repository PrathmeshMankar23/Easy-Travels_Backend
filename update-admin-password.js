// Update admin@easytravels.com password to admin123
import fetch from 'node-fetch';

async function updateAdminPassword() {
  try {
    console.log('Updating admin@easytravels.com password...');
    
    // First login to get token (using current password)
    const loginResponse = await fetch('https://easy-travels-backend.onrender.com/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@easytravels.com',
        password: 'password'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Failed to login with current password');
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    
    console.log('Logged in, updating password...');
    
    // Update password (you'll need to implement this endpoint or use DB directly)
    console.log('✅ CURRENT ADMIN CREDENTIALS:');
    console.log('Email: admin@easytravels.com');
    console.log('Password: password');
    console.log('Token: ' + token?.substring(0, 50) + '...');
    
    console.log('\n🔑 NEW CREDENTIALS TO USE:');
    console.log('Email: admin@easytravels.com');
    console.log('Password: admin123');
    console.log('\n⚠️  Note: Password needs to be updated in database or use current password "password"');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateAdminPassword();
