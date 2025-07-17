const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // ensure the uploads folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
    const { productname, enabled, file } = req.body;
    console.log('req.file:', req.file);    // check this logs a valid file object
    console.log('req.body:', req.body);    // check that productname and enabled are present

    if (!req.file) {
        return res.status(400).json({ message: 'Image is required.' });
    }

    if (!productname || !enabled || file) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const imagePath = req.file.path;


    try {
        const newProduct = new Product({
            product_name: productname,
            enabled: enabled === 'true', // Convert to boolean
            image: imagePath, // Save file path if file is uploaded
        });

        await newProduct.save();
        res.status(200).json({ message: 'Product added successfully.' });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;