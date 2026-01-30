import axios from 'axios';

const testAPI = async () => {
    try {
        console.log('Testing /api/crop-prices...');
        const pricesRes = await axios.get('http://localhost:5000/api/crop-prices?limit=10');
        console.log('Crop Prices Count:', pricesRes.data.count);
        
        console.log('\nTesting /api/ai/crop-rankings...');
        const rankingsRes = await axios.get('http://localhost:5000/api/ai/crop-rankings');
        console.log('Rankings Response:', JSON.stringify(rankingsRes.data, null, 2));
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
};

testAPI();
