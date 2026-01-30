import axios from 'axios';

const testEndpoints = async () => {
    try {
        console.log('Testing /api/ai/crop-rankings endpoint...\n');
        
        const response = await axios.get('http://localhost:5000/api/ai/crop-rankings', {
            timeout: 30000
        });
        
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
    process.exit(0);
};

// Wait a moment for server to be ready
setTimeout(testEndpoints, 2000);
