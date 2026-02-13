// Test admin login API endpoint directly
const testLogin = async () => {
  try {
    console.log('🔍 Testing admin login API...');
    
    const response = await fetch('http://localhost:5001/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@easytravels.com',
        password: 'admin123'
      })
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', response.headers);
    
    const data = await response.json();
    console.log('📦 Response data:', data);
    
    if (response.ok && data.token) {
      console.log('✅ Login API working correctly!');
    } else {
      console.log('❌ Login API failed:', data.message || data.error);
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error);
    console.log('🔧 Possible issues:');
    console.log('   1. Backend not running on port 5001');
    console.log('   2. CORS issues');
    console.log('   3. Wrong API endpoint');
  }
};

testLogin();
