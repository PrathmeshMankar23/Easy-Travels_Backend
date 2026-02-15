// Create multiple admins in production backend
import fetch from 'node-fetch';

async function createMultipleAdmins() {
  const admins = [
    { username: 'admin1', email: 'admin1@easytravels.com', password: 'admin123' },
    { username: 'admin2', email: 'admin2@easytravels.com', password: 'admin123' },
    { username: 'manager', email: 'manager@easytravels.com', password: 'manager123' }
  ];

  for (const admin of admins) {
    try {
      console.log(`Creating admin: ${admin.email}...`);
      
      const response = await fetch('https://easy-travels-backend.onrender.com/api/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...admin,
          role: 'ADMIN'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Admin created: ${admin.email}`);
      } else {
        const error = await response.json().catch(() => ({}));
        console.log(`❌ Failed to create ${admin.email}:`, error.message);
      }
      
    } catch (error) {
      console.error(`❌ Error creating ${admin.email}:`, error.message);
    }
  }
}

createMultipleAdmins();
