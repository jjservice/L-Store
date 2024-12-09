// Get references to necessary DOM elements
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartContainer = document.getElementById('cart-container');
const toggleCartButton = document.getElementById('toggle-cart');
const checkoutButton = document.getElementById('checkout-button');

// Function to update the cart display and local storage
function updateCart() {
  // Retrieve the cart from localStorage (or an empty array if not found)
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Clear the current cart display
  cartItemsContainer.innerHTML = '';

  // Initialize total price
  let totalPrice = 0;

  // Iterate through the cart items and display them
  cart.forEach((item, index) => {
    const listItem = document.createElement('li');

    // Display the product image, name, price, and quantity
    listItem.innerHTML = `
    <img src="${item.image}" alt="${item.product}">
    <div class="product-name">${item.product}</div>
    $${item.price} 
    <input type="number" class="quantity-input" value="${item.quantity}" data-index="${index}" min="1">
    x $${item.price} = $${(item.quantity * item.price).toFixed(2)}
    <button class="remove-item" data-index="${index}">Remove</button>
  `;

    // Append the list item to the cart
    cartItemsContainer.appendChild(listItem);

    // Update the total price
    totalPrice += item.price * item.quantity;
  });

  // Update the total price display
  totalPriceElement.textContent = totalPrice.toFixed(2);

  // Save the updated cart back to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Update the cart item count on the toggle cart button
  updateCartItemCount(cart);
}

// Function to update the cart item count indicator on the toggle button
function updateCartItemCount(cart) {
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0); // Get total items in the cart
  const badge = toggleCartButton.querySelector('.cart-badge');

  if (cartItemCount > 0) {
    // Show the badge and update the count
    if (!badge) {
      const newBadge = document.createElement('span');
      newBadge.classList.add('cart-badge');
      toggleCartButton.appendChild(newBadge);
    }
    toggleCartButton.querySelector('.cart-badge').textContent = cartItemCount;
  } else {
    // Hide the badge if no items are in the cart
    if (badge) {
      badge.remove();
    }
  }
}

    // Function to handle adding items to the cart
    function addToCart(event) {
      const button = event.target;
      const product = button.getAttribute('data-product');
      const price = parseFloat(button.getAttribute('data-price'));
      const image = button.getAttribute('data-image');

      // Retrieve the current cart from localStorage or initialize it as an empty array
      const cart = JSON.parse(localStorage.getItem('cart')) || [];

      // Check if the product is already in the cart
      const existingItem = cart.find(item => item.product === product);

      if (existingItem) {
        // If the product already exists, increase the quantity
        existingItem.quantity += 1;
      } else {
        // Otherwise, add the new product to the cart
        cart.push({ product, price, quantity: 1, image });
      }

      // Save the updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));

      // Update the cart display
      updateCart();
    }


// Function to handle removing items from the cart
function removeItem(event) {
  const index = event.target.getAttribute('data-index');

  // Retrieve the current cart from localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Remove the item from the cart based on the index
  cart.splice(index, 1);

  // Update the cart in localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Update the cart display
  updateCart();
}

// Function to handle editing the quantity of an item
function editQuantity(event) {
  if (event.target.classList.contains('quantity-input')) {
    const index = event.target.getAttribute('data-index');
    const newQuantity = parseInt(event.target.value);

    // Retrieve the current cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Update the quantity of the item
    if (newQuantity > 0) {
      cart[index].quantity = newQuantity;
    } else {
      // If the quantity is 0 or less, remove the item from the cart
      cart.splice(index, 1);
    }

    // Update the cart in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart display
    updateCart();
  }
}

// Function to toggle the visibility of the cart
function toggleCart() {
  // Toggle the 'hidden' class on the cart container
  cartContainer.classList.toggle('hidden');

  // Change the button text based on cart visibility
  if (cartContainer.classList.contains('hidden')) {
    toggleCartButton.textContent = 'Shopping Cart';
  } else {
    toggleCartButton.textContent = 'Hide Cart';
  }
}

// Function to handle checkout process
function checkout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Check if the cart is empty
  if (cart.length === 0) {
    alert("Your cart is empty. Please add items before checking out.");
    return;
  }

  // Calculate the total price
  let totalPrice = 0;
  cart.forEach(item => {
    totalPrice += item.price * item.quantity;
  });

  // Display order summary
  alert(`Your order has been placed successfully!\nTotal: $${totalPrice.toFixed(2)}`);

  // Clear the cart after checkout
  localStorage.removeItem('cart');
  updateCart(); // Update the cart display to reflect the empty cart
}

// Add event listeners to the "Add to Cart" buttons
addToCartButtons.forEach(button => {
  button.addEventListener('click', addToCart);
});

// Add event listener to the "Remove" buttons in the cart
cartItemsContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('remove-item')) {
    removeItem(event);
  }
});

// Add event listener to the quantity input fields
cartItemsContainer.addEventListener('input', (event) => {
  editQuantity(event);
});

// Initialize the cart display on page load
updateCart();

//// Light Section ////

function toggleClassPlayer(){
  const body = document.querySelector('body');
  body.classList.toggle('lightStore');
}

///// Payment Section ///////

// Add your publishable key from the Stripe Dashboard
const stripe = Stripe('pk_live_51QTSb2LPa32ZluPp1YadZwNsFhMmn4a5u1sYzy0bgbIL1yD1LFuGXQcn3CgEBAwaBucY7RK5GwT51oEo44hDNbvo001nhm4Exe');  // Replace with your actual key

// Function to handle checkout process with Stripe
async function checkout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Check if the cart is empty
  if (cart.length === 0) {
    alert("Your cart is empty. Please add items before checking out.");
    return;
  }

  // Create an array of items in the format expected by Stripe
  const lineItems = cart.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.product
      },
      unit_amount: Math.round(item.price * 100),  // Stripe expects amounts in cents
    },
    quantity: item.quantity,
  }));

  try {
    // Send the line items to your server to create a Checkout Session
    const response = await fetch('/create-checkout-session', {  // Replace with your server's endpoint
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: lineItems })
    });

    const session = await response.json();

    if (session.error) {
      alert(session.error);
      return;
    }

    // Redirect to Stripe's Checkout page
    const { error } = await stripe.redirectToCheckout({ sessionId: session.id });

    if (error) {
      alert(error.message);
    }

  } catch (error) {
    console.error("Error during checkout:", error);
    alert("An error occurred during checkout. Please try again later.");
  }
}

// Event listener for the checkout button
checkoutButton.addEventListener('click', checkout);

