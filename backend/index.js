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
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

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
        const products = await Product.find({}); // Fetch all products
        res.status(200).json(products);
    } catch (error) {
        console.error('Error getting data:', error.message);
        res.status(500).json({ error: 'Failed to fetch all data from MongoDB' });
    }
});

app.get('/api/summary', async (req, res) => {
    try {
        const products = await Product.find({}, 'product_name servings nutriments.energy-kcal_value serving_quantity_unit serving_quantity') // Fetch the names and serving sizes of all products
        res.status(200).json(products);
    } catch (error) {
        console.error('Error getting data:', error.message);
        res.status(500).json({ error: 'Failed to fetch all data from MongoDB' });
    }
});

app.get('/api/totals', async (req, res) => {
    try {
        const products = await Product.find({}, 'nutriments' )
        // Fetch the names and serving sizes of all products

        const totals = {};
        // Sum nutrition facts across all products
        products.forEach(product => {
            const productNutrition = product.nutriments;
            Object.entries(productNutrition).forEach(([key, value]) => {
                if (key.endsWith("_unit") || key.endsWith("_100g") || key.endsWith("_serving") || key === "salt" || key.endsWith('energy')) return;
                const unitKey = key + "_unit";
                const unit = productNutrition[unitKey] || "";

                if (!totals[key]) {
                    totals[key] = 0;
                }

                if (typeof value === 'number') {
                    totals[key] += value;
                }
            });
        });

        // rename 'energy-kcal' to 'Calories' and capitalize the first letter of every key
        const reformattedTotals = {};
        Object.entries(totals).forEach(([key, value]) => {
            let newKey;

            if (key === 'energy-kcal') {
                newKey = 'Calories';
            } else if (key.startsWith('vitamin-')) {
                // Handle vitamin keys: capitalize "Vitamin" and the entire second word
                newKey = key
                    .replace('vitamin-', 'Vitamin ') // Replace "vitamin-" with "Vitamin "
                    .replace(/ (\w+)/, (_, secondWord) => ` ${secondWord.toUpperCase()}`); // Capitalize the second word
            } else {
                // Capitalize the first letter of each word
                newKey = key
                    .replace(/-/g, ' ') // Replace dashes with spaces
                    .split(' ') // Split into words
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
                    .join(' '); // Join words back together
            }
            
            reformattedTotals[newKey] = value;
        });
        console.log('Reformatted Totals:', reformattedTotals);
        res.status(200).json(reformattedTotals);
    } catch (error) {
        console.error('Error getting data:', error.message);
        res.status(500).json({ error: 'Failed to fetch all data from MongoDB' });
    }
});

app.get('/api/:productID', async (req, res) => {
    try {
        // MOCK THE API SINCE ITS DOWN RN
        // res.json({"code": "0038000265013", "product": {"nutriments": {"added-sugars": 9, "added-sugars_100g": 40.9, "added-sugars_serving": 9, "added-sugars_unit": "g", "added-sugars_value": 9, "carbohydrates": 17, "carbohydrates_100g": 77.3, "carbohydrates_serving": 17, "carbohydrates_unit": "g", "carbohydrates_value": 17, "energy": 377, "energy-kcal": 90, "energy-kcal_100g": 409, "energy-kcal_serving": 90, "energy-kcal_unit": "kcal", "energy-kcal_value": 90, "energy-kcal_value_computed": 90, "energy_100g": 1710, "energy_serving": 377, "energy_unit": "kcal", "energy_value": 90, "fat": 2, "fat_100g": 9.09, "fat_serving": 2, "fat_unit": "g", "fat_value": 2, "folates": 0.000319, "folates_100g": 0.00145, "folates_serving": 0.000319, "folates_unit": "µg", "folates_value": 319, "fruits-vegetables-legumes-estimate-from-ingredients_100g": 1.44230769230769, "fruits-vegetables-legumes-estimate-from-ingredients_serving": 1.44230769230769, "fruits-vegetables-nuts-estimate-from-ingredients_100g": 1.44230769230769, "fruits-vegetables-nuts-estimate-from-ingredients_serving": 1.44230769230769, "insoluble-fiber": 0, "insoluble-fiber_100g": 0, "insoluble-fiber_serving": 0, "insoluble-fiber_unit": "g", "insoluble-fiber_value": 0, "iron": 0.00036, "iron_100g": 0.00164, "iron_serving": 0.00036, "iron_unit": "g", "iron_value": 0.00036, "nova-group": 4, "nova-group_100g": 4, "nova-group_serving": 4, "nutrition-score-fr": 23, "nutrition-score-fr_100g": 23, "proteins": 1, "proteins_100g": 4.55, "proteins_serving": 1, "proteins_unit": "g", "proteins_value": 1, "salt": 0.2625, "salt_100g": 1.19, "salt_serving": 0.2625, "salt_unit": "g", "salt_value": 0.2625, "saturated-fat": 0.5, "saturated-fat_100g": 2.27, "saturated-fat_serving": 0.5, "saturated-fat_unit": "g", "saturated-fat_value": 0.5, "sodium": 0.105, "sodium_100g": 0.477, "sodium_serving": 0.105, "sodium_unit": "g", "sodium_value": 0.105, "soluble-fiber": 0, "soluble-fiber_100g": 0, "soluble-fiber_serving": 0, "soluble-fiber_unit": "g", "soluble-fiber_value": 0, "sugars": 9, "sugars_100g": 40.9, "sugars_serving": 9, "sugars_unit": "g", "sugars_value": 9, "vitamin-b2": 0.00013, "vitamin-b2_100g": 0.000591, "vitamin-b2_serving": 0.00013, "vitamin-b2_unit": "g", "vitamin-b2_value": 0.00013, "vitamin-b9": 0.00004, "vitamin-b9_100g": 0.000182, "vitamin-b9_serving": 0.00004, "vitamin-b9_unit": "g", "vitamin-b9_value": 0.00004, "vitamin-pp": 0.009091, "vitamin-pp_100g": 0.0413, "vitamin-pp_serving": 0.009091, "vitamin-pp_unit": "mg", "vitamin-pp_value": 9.091}, "product_name": "The original crispy marshmallow squares, the original", "schema_version": 998, "selected_images": {"front": [Object], "ingredients": [Object], "nutrition": [Object]}, "serving_quantity": "22", "serving_quantity_unit": "g"}, "status": 1, "status_verbose": "product found"})
        
        const productID = req.params.productID
        const apiURL = `https://world.openfoodfacts.org/api/v2/product/${productID}?product_type=food&fields=product_name%2Cnutriments%2Cselected_images%2Cserving_quantity%2Cserving_quantity_unit`
        const response = await axios.get(apiURL);
        res.json(response.data);
    } catch (error) {
        console.error('Error querying the API:', error.message);
        res.status(500).json({ error: 'Failed to fetch data from the API' });
    }
});

app.post('/api/genai', async (req, res) => {
    try {
        const nutritionFacts = req.body.nutritionFacts;
        if (!nutritionFacts) return res.status(400).json({ error: 'Nutrition facts are required' });
        const nutritionValues = Object.entries(nutritionFacts).map(([key, value]) => `${key}: ${value}`).join(', ');
        const prompt = `Based on the following nutritional values: ${nutritionValues}, in a short paragraph tell me about my overall health. Give me 2 values that are good including their health benefits and 2 values that are bad and the possible effects of said values. Explain all of this is like how a doctor would casually speak to me without any markdown formatting. Just a short paragraph`;
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
        res.json(response);
    } catch (error) {
        console.error('Error querying the GenAI API:', error.message);
        res.status(500).json({ error: 'Failed to fetch data from the GenAI API' });
    }
});

app.delete('/api/:productID', async (req, res) => {
    try {
        const productID = req.params.productID; // Extract productID from request parameters
        const result = await Product.deleteOne({ _id: productID }); // Delete product by ID
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).json({ error: 'Failed to delete product from database' });
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