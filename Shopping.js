// Store Cart Data
let cart = [];

// Update Cart UI
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';  // Clear previous items

    let total = 0;
    cart.forEach((item, index) => {
        const li = document.createElement('li');

        // Display product name, price, and quantity
        li.innerHTML = `${item.name} - $${item.price} x <input type="number" class="quantity" value="${item.quantity}" min="1" data-index="${index}" />`;

        // Create Remove Button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-item');
        removeBtn.addEventListener('click', () => removeFromCart(index)); // Attach event listener

        // Append Remove Button to the list item
        li.appendChild(removeBtn);
        cartItems.appendChild(li);

        // Update Total
        total += item.price * item.quantity;
    });

    // Update Total
    document.getElementById('total').textContent = total;
}

// Add item to cart
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const productName = e.target.getAttribute('data-product');
        const productPrice = parseInt(e.target.getAttribute('data-price'));
        
        // Check if the item is already in the cart, if yes, increase the quantity
        const existingItem = cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name: productName, price: productPrice, quantity: 1 });
        }

        updateCart();
    });
});

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);  // Remove item from the cart by index
    updateCart();  // Re-update the cart display after removing the item
}

// Update quantity in the cart
document.getElementById('cart-items').addEventListener('input', (e) => {
    if (e.target.classList.contains('quantity')) {
        const index = e.target.getAttribute('data-index');
        const newQuantity = parseInt(e.target.value);

        if (newQuantity > 0) {
            cart[index].quantity = newQuantity;  // Update quantity in the cart
            updateCart();  // Re-update the cart display
        }
    }
});

// Open Payment Modal
document.getElementById('checkout-btn').addEventListener('click', () => {
    document.getElementById('payment-modal').style.display = 'block';
});

// Handle Payment (Mock or use Stripe)
document.getElementById('payment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Here you can integrate Stripe, PayPal or any other payment processor.
    // For now, we'll simulate a successful payment.
    alert('Payment successful! Your order has been processed.');
    cart = [];  // Clear cart after payment
    updateCart();  // Update cart display
    document.getElementById('payment-modal').style.display = 'none';
});



// Lights Section //////////////////////////////////
function toggleClassPlayer(){

    const body = document.querySelector('body');
    body.classList.toggle('lightStore');
    
    }
