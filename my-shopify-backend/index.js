require('dotenv').config(); // CommonJS import for dotenv
const fetch = require('node-fetch'); // CommonJS import for node-fetch
const express = require('express');

const app = express();
const port = 3000;

// Set the views directory to use EJS templating
app.set('view engine', 'ejs');
app.set('views', './views');

// Serve static files (like images, CSS, JS)
app.use(express.static('public'));

// Home route to render the index page
app.get('/', (req, res) => {
  res.render('index');
});

// Shopify API Route - Example of getting orders
app.get('/orders', async (req, res) => {
  const url = `https://${process.env.SHOPIFY_STORE}/admin/api/2024-01/orders.json`;
  const headers = {
    'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
  };

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
