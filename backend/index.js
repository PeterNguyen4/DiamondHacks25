const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3001;

// Middleware to parse JSON
app.use(express.json());

app.get('/test/:productID', (req, res) => {
    console.log('ID:', req.params.productID)
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