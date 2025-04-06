const express = require('express');
const axios = require('axios');
const cors = require('cors');
const connectDB = require('./db'); // Import the database connection
// Connect to MongoDB
const Product = require('./model/product')
connectDB();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Receive modified nutrition facts and save to database
app.post('/api/product', async (req, res) => {
    try {
        const productData = req.body; // Get JSON object from request body
        if (!productData) {
            return res.status(400).json({ error: 'Invalid product data' });
        }
        const product = new Product(productData);
        const result = await product.save(); // Save to MongoDB
        res.status(201).json({ message: 'Product saved successfully', id: result._id });
    } catch (error) {
        console.error('Error saving product to database:', error.message);
        res.status(500).json({ error: 'Failed to save product to database' });
    }
});

// Retrieve all products from the database
app.get('/api/products', async (req, res) => {
    try {
        console.log('get all endpoint')
        const products = await Product.find({}); // Fetch all products
        res.status(200).json(products);
    } catch (error) {
        console.error('Error getting data:', error.message);
        res.status(500).json({ error: 'Failed to fetch all data from MongoDB' });
    }
});

app.get('/api/:productID', async (req, res) => {
    try {
        const productID = req.params.productID
        const apiURL = `https://world.openfoodfacts.net/api/v2/product/${productID}?product_type=food&fields=product_name%2Cnutriments%2Cselected_images%2Cserving_quantity%2Cserving_quantity_unit`
        const response = await axios.get(apiURL);
        res.json(response.data);
    } catch (error) {
        console.error('Error querying the API:', error.message);
        res.status(500).json({ error: 'Failed to fetch data from the API' });
    }
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});