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

app.get('/test/:productID', (req, res) => {
    console.log('ID:', req.params.productID)
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

app.get('/api/summary', async (req, res) => {
    try {
        const products = await Product.find({}, { 
            projection: {
                'product.product_name': 1, 
                'product.serving_quantity': 1, 
                'product.serving_quantity_unit': 1, 
                _id: 0
            }
        }); // Fetch the names and serving sizes of all products

        // Join serving quantity and unit into a single string
        const productNamesAndServingSizes = products.map(product => ({
            name: product.product.product_name,
            serving_size: `${product.product.serving_quantity} ${product.product.serving_quantity_unit}`
        }));
        res.status(200).json(productNamesAndServingSizes);
    } catch (error) {
        console.error('Error getting data:', error.message);
        res.status(500).json({ error: 'Failed to fetch all data from MongoDB' });
    }
});

app.get('/api/totals', async (req, res) => {
    try {
        const products = await Product.find({}, { 
            projection: {
                'product.product_name': 1, 
                'product.serving_quantity': 1, 
                'product.serving_quantity_unit': 1, 
                'product.nutriments:': 1,
                _id: 0
            }
        }); // Fetch the names and serving sizes of all products

        const totals = {};

        // Sum nutrition facts across all products
        products.forEach(product => {
            const productData = product.product;
            Object.entries(productData.nutriments).forEach(([key, value]) => {
                if (key.endsWith("_unit") || key.endsWith("_100g") || key.endsWith("_serving") || key === "salt") return;
                const unitKey = key + "_unit";
                const unit = productData.nutriments[unitKey] || "";
                if (key === "energy-kcal") {
                    value = Math.round(value);
                    totals["energy-kcal"] = `${value} ${unit}`.trim();
                } else if (key !== "energy") {
                    totals[key] = `${value} ${unit}`.trim();
                }

                if (!totals[key]) {
                    totals[key] = 0;
                }

                if (typeof value === 'number') {
                    totals[key] += value;
                }
            });
        });
        res.status(200).json(totals);
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