const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_name: { type: String, required: true }, 
    enabled: { type: String, required: true },
    image: { type: String, required: true },
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});
module.exports = mongoose.model('products', productSchema);
