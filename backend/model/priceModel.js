import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
    state: { type: String, required: true },
    district: { type: String, required: true },
    market: { type: String, required: true },
    commodity: { type: String, required: true },
    variety: { type: String },
    modal_price: { type: Number, required: true },
    min_price: { type: Number },
    max_price: { type: Number },
    arrival_date: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
}, { timestamps: true });

// Index for faster queries
priceSchema.index({ commodity: 1, arrival_date: 1 });
priceSchema.index({ district: 1, commodity: 1 });

const Price = mongoose.model('Price', priceSchema);
export default Price;
