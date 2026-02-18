const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productname: { type: String, required: true },
    sku:{type: String,required:true},
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

