const fetch = require('node-fetch'); // You'll need to install this package or use native fetch in Vercel's environment.

// Shopify API Credentials (replace with your store's credentials)
const SHOPIFY_API_URL = 'https://your-shop-name.myshopify.com/admin/api/2023-10/orders.json';
const ACCESS_TOKEN = 'your-shopify-access-token';  // Replace this with your private app access token

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Get order data from the request body
            const { name, phone, address, province, productId, variantId, quantity, price, deliveryMethod, shipmentPrice } = req.body;

            // Create the order payload
            const orderData = {
                order: {
                    line_items: [
                        {
                            variant_id: parseInt(variantId), // Make sure the variantId is an integer
                            quantity: parseInt(quantity), // Ensure the quantity is an integer
                            price: parseFloat(price).toFixed(2), // Ensure the price is in float and formatted to 2 decimals
                        }
                    ],
                    customer: {
                        first_name: name,
                        phone: phone,
                    },
                    shipping_address: {
                        address1: address,
                        province: province,
                    },
                    payment_gateway_names: ['manual'], // Can be adjusted based on your needs
                    total_price: parseFloat(price * quantity).toFixed(2), // Adjust total price accordingly
                    total_tax: 0, // You can calculate tax if needed
                    shipping_lines: [
                        {
                            title: deliveryMethod,
                            price: parseFloat(shipmentPrice).toFixed(2), // Make sure shipment price is formatted properly
                        }
                    ],
                }
            };

            // Make request to Shopify API to create an order
            const response = await fetch(SHOPIFY_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': ACCESS_TOKEN,
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (response.ok) {
                res.status(200).json({ message: 'Order placed successfully!', order: data });
            } else {
                res.status(400).json({ message: 'Error placing order', errors: data });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
