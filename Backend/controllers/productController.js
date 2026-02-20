const Product = require('../models/product');

const createProduct = async (req, res) => {
    try {
        const { productname, sku, description, price, quantity, isActive } = req.body;
        if (await Product.findOne({ sku })) {
            return res.status(400).json({ error: 'Product already exists with same SKU' });
        }
        const newProduct = new Product({ productname, sku, description, price, quantity, isActive });
        await newProduct.save();
        res.status(201).json(newProduct);
    }
    catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { productname, sku, description, price, quantity, isActive } = req.body;
        const existingProduct = await Product.findOne({
            sku,
            _id: { $ne: id }   // exclude current document
        });

        if (existingProduct) {
            return res.status(400).json({
                error: "Product already exists with same SKU"
            });
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { productname, description, price, quantity, isActive },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    getProductById
}