import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Price from './model/priceModel.js';

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const count = await Price.countDocuments();
        console.log('Total price records:', count);
        
        if (count === 0) {
            console.log('No price data found. Please run: node store_prices.js');
        } else {
            const sample = await Price.findOne();
            console.log('Sample record:', JSON.stringify(sample, null, 2));
        }
        
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error.message);
    }
};

checkDB();
