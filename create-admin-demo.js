// Create admin@easytravels.com demo admin
import fetch from 'node-fetch';

async function createAdminDemo() {
  try {
    console.log('Creating admin@easytravels.com demo...');
    
    const response = await fetch('https://easy-travels-backend.onrender.com/api/admin/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        email: 'admin@easytravels.com',
        password: 'admin123',
        role: 'ADMIN'
      })
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Admin demo created:', data);
      console.log('\n🔑 FINAL DEMO CREDENTIALS:');
      console.log('Email: admin@easytravels.com');
      console.log('Password: admin123');
      console.log('Username: admin');
    } else {
      const error = await response.json().catch(() => ({}));
      console.log('❌ Failed to create admin demo:', error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdminDemo();
