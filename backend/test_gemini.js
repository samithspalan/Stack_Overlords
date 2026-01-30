import { GoogleGenerativeAI } from '@google/generative-ai';
import Price from './model/priceModel.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testGemini = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        // Test getting crops from DB
        const commodities = await Price.distinct('commodity');
        console.log('Total unique commodities:', commodities.length);
        console.log('Sample commodities:', commodities.slice(0, 5));
        
        // Test Gemini
        console.log('\nTesting Gemini API...');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const testPrompt = 'List 3 crops in JSON format with name and demand level (high/medium/low).';
        const result = await model.generateContent(testPrompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('Gemini Response (first 200 chars):');
        console.log(text.substring(0, 200));
        
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error.message);
    }
};

testGemini();
