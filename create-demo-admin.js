// Create demo admin for testing
import fetch from 'node-fetch';

async function createDemoAdmin() {
  try {
    console.log('Creating demo admin for testing...');
    
    const response = await fetch('https://easy-travels-backend.onrender.com/api/admin/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'demo',
        email: 'demo@easytravels.com',
        password: 'demo123',
        role: 'ADMIN'
      })
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Demo admin created:', data);
      console.log('\n🔑 DEMO CREDENTIALS:');
      console.log('Email: demo@easytravels.com');
      console.log('Password: demo123');
      console.log('Username: demo');
    } else {
      const error = await response.json().catch(() => ({}));
      console.log('❌ Failed to create demo admin:', error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createDemoAdmin();
