const axios = require('axios');

const URL = 'http://127.0.0.1:8080/api/market-prices';

async function fetchData() {
    try {
        console.log(`Fetching data from ${URL}...`);
        const response = await axios.get(URL);
        console.log('Response Status:', response.status);
        if (response.data && response.data.records && response.data.records.length > 0) {
            console.log('First Record:', response.data.records[0]);
        } else {
            console.log('No records found.');
        }
    } catch (error) {
        console.error('Error fetching data:', error.code || error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
        }
    }
}

fetchData();
