document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');
    
    orderForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(orderForm);
        const orderData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            province: formData.get('province'),
            productId: formData.get('productId'),
            variantId: formData.get('variantId'),
            quantity: formData.get('quantity'),
            price: formData.get('price'),
            deliveryMethod: formData.get('deliveryMethod'),
            shipmentPrice: formData.get('shipmentPrice'),
        };

        try {
            const response = await fetch('/api/createOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();

            if (response.ok) {
                document.getElementById('orderFeedback').innerText = "Order placed successfully!";
            } else {
                document.getElementById('orderFeedback').innerText = "Error: " + result.message;
            }
        } catch (error) {
            document.getElementById('orderFeedback').innerText = "There was an error processing your order.";
            console.error('Error:', error);
        }
    });
});
