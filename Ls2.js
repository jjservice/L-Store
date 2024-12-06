// Sample products data with images
const products = [
    { 
        id: 1, 
        name: "Bulova Oceanographer Men's Automatic-Watch", 
        price: 40, 
        images: ["Bulova-Oceanographer-Men's-Automatic-Watch-pic6.avif", "img4.jpg", "img5.jpg", "img6.jpg"]
    },
    { 
        id: 2, 
        name: "G-Shock Digital Black and Red Watch", 
        price: 40, 
        images: ["G-Shock-Digital-Black-Red-Shock--Watch-Pic7.avif", "img4.jpg", "img5.jpg", "img6.jpg"]
    },
    { 
        id: 3, 
        name: "Bulova Men's Marine Star-Chronograph", 
        price: 40, 
        images: ["Bulova-Men's-Marine Star-ChronographPic4.jpg", "img4.jpg", "img5.jpg", "img6.jpg"]
    },
    { 
        id: 4, 
        name: "V-Code Lady's Watch", 
        price: 40, 
        images: ["V-Code-Lady-Watch-Pic.avif", "img4.jpg", "img5.jpg", "img6.jpg"]
    },
    { 
        id: 5, 
        name: "The Snob Men's Watch", 
        price: 10, 
        images: ["The-Watch-Snob-pic3.jpg", "Image-Car2.avif", "Image-Car3.avif", "Image-Car4.avif"]
    },
    { 
        id: 6, 
        name: "Elegant Cars, Luxuries", 
        price: 20, 
        images: ["Image-Car5.avif", "Image-Car6.avif", "Image-Car7.avif", "Image-Car8.avif"]
    },
    { 
        id: 7, 
        name: "Cars, modern Cars, Luxury", 
        price: 30, 
        images: ["Image-Car9.avif", "Image-Car10.avif", "img1.jpg", "img2.jpg"]
    },
    { 
        id: 8, 
        name: "Asap Rocky", 
        price: 40, 
        images: ["img3.jpg", "img4.jpg", "img5.jpg", "img6.jpg"]
    },
];

// Cart array to store added items (with quantities)
let cart = [];

// Function to render products on the page
function renderProducts() {
  const productSection = document.getElementById('productSection');
  productSection.innerHTML = ''; // Clear existing products
  products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');

      // Image slider code for each product
      const imagesSlider = product.images.map((image, index) => {
          return `
              <div class="slider-image" style="display: ${index === 0 ? 'block' : 'none'}">
                  <img src="${image}" alt="${product.name} Image ${index + 1}" width="100" height="100">
              </div>
          `;
      }).join('');

      productCard.innerHTML = `
          <div class="image-slider">
              ${imagesSlider}
              <button onclick="showNextImage(${product.id})">Next</button>
              <button onclick="showPreviousImage(${product.id})">Previous</button>
          </div>
          <h3>${product.name}</h3>
          <p>$${product.price}</p>
          <label for="quantity-${product.id}">Quantity:</label>
          <input type="number" id="quantity-${product.id}" value="1" min="1">
          <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      productSection.appendChild(productCard);
  });
}

// Function to show the next image in the slider
function showNextImage(productId) {
  const product = products.find(p => p.id === productId);
  const sliderImages = document.querySelectorAll(`#productSection .product-card:nth-child(${productId}) .slider-image`);
  let currentIndex = -1;

  sliderImages.forEach((imageDiv, index) => {
      if (imageDiv.style.display === 'block') {
          currentIndex = index;
          imageDiv.style.display = 'none';
      }
  });

  // Show the next image
  const nextIndex = (currentIndex + 1) % sliderImages.length;
  sliderImages[nextIndex].style.display = 'block';
}

// Function to show the previous image in the slider
function showPreviousImage(productId) {
  const product = products.find(p => p.id === productId);
  const sliderImages = document.querySelectorAll(`#productSection .product-card:nth-child(${productId}) .slider-image`);
  let currentIndex = -1;

  sliderImages.forEach((imageDiv, index) => {
      if (imageDiv.style.display === 'block') {
          currentIndex = index;
          imageDiv.style.display = 'none';
      }
  });

  // Show the previous image
  const prevIndex = (currentIndex - 1 + sliderImages.length) % sliderImages.length;
  sliderImages[prevIndex].style.display = 'block';
}

// Function to add product to cart (with quantity)
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const quantityInput = document.getElementById(`quantity-${productId}`);
  const quantity = parseInt(quantityInput.value);

  // Check if the product is already in the cart
  const existingProduct = cart.find(item => item.product.id === productId);
  if (existingProduct) {
      // Update quantity of the existing product in the cart
      existingProduct.quantity += quantity;
  } else {
      // Add the new product to the cart
      cart.push({ product, quantity });
  }

  renderCart();
}

// Function to update quantity in the cart
function updateQuantity(productId, newQuantity) {
  const existingProduct = cart.find(item => item.product.id === productId);
  if (existingProduct && newQuantity >= 1) {
      // Update the quantity if valid
      existingProduct.quantity = newQuantity;
      renderCart();
  }
}

// Function to remove product from cart
function removeFromCart(productId) {
  // Remove the product from the cart
  cart = cart.filter(item => item.product.id !== productId);
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const totalPriceElement = document.getElementById('totalPrice');
  const checkoutButton = document.getElementById('checkoutButton');  // Add reference to checkout button
  
  // Clear current cart items
  cartItems.innerHTML = '';

  // Display each cart item with quantity input and a remove button
  cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
          <img src="${item.product.images[0]}" alt="${item.product.name}" width="50" height="50">
          ${item.product.name} - $${item.product.price} x 
          <input type="number" value="${item.quantity}" min="1" 
              onchange="updateQuantity(${item.product.id}, this.value)">
          = $${item.product.price * item.quantity}
          <button onclick="removeFromCart(${item.product.id})">Remove</button>
      `;
      cartItems.appendChild(cartItem);
  });

  // Update total price
  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  totalPriceElement.textContent = total;

  // Show or hide the Checkout button based on cart items
  if (cart.length > 0) {
      checkoutButton.style.display = 'block';  // Show the Checkout button
  } else {
      checkoutButton.style.display = 'none';  // Hide the Checkout button
  }
}


// Function to display checkout form
function renderCheckout() {
  const checkoutSection = document.getElementById('checkoutSection');
  checkoutSection.innerHTML = `
      <h3>Checkout</h3>
      <p>Total: $<span id="checkoutTotal">${getTotalPrice()}</span></p>
      <div>
          <label for="name">Name:</label>
          <input type="text" id="name" required>
      </div>
      <div>
          <label for="address">Address:</label>
          <input type="text" id="address" required>
      </div>
      <div>
          <label for="paymentMethod">Payment Method:</label>
          <select id="paymentMethod" required>
              <option value="creditCard">Credit Card</option>
              <option value="paypal">PayPal</option>
          </select>
      </div>
      <button onclick="processPayment()">Pay Now</button>
  `;
}

// Function to get the total price of the cart
function getTotalPrice() {
  return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
}

// Function to simulate the payment process (link to a payment gateway)
function processPayment() {
  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;
  const paymentMethod = document.getElementById('paymentMethod').value;

  if (!name || !address || !paymentMethod) {
      alert("Please fill out all fields.");
      return;
  }

  // Simulate the checkout process
  alert(`Thank you for your purchase, ${name}! You have successfully paid via ${paymentMethod}.`);
  cart = [];  // Empty the cart after checkout
  renderCart(); // Update cart display
  renderCheckout(); // Re-render checkout section
}

// Initialize the page
renderProducts();




//////Strip Payment Methods//////////////////////////////////////

async function processPayment() {
  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;
  const paymentMethod = document.getElementById('paymentMethod').value;

  if (!name || !address || !paymentMethod) {
      console.error("Please fill out all fields.");
      alert("Please fill out all fields.");
      return;
  }

  const totalAmount = getTotalPrice() * 100; // Amount in cents

  const stripe = stripe('your-publishable-key'); // Replace with your Stripe publishable key

  try {
      // Call your backend server to create a payment session
      const response = await fetch('/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ totalAmount })
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const session = await response.json();

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId: session.id });

      if (error) {
          console.error("Error during Stripe Checkout redirection:", error.message);
          alert(error.message);
      }
  } catch (error) {
      console.error("Error in processPayment:", error.message);
      alert("An error occurred during the payment process. Please try again later.");
  }
}

///////Search Bar////////////
// Function to filter and display products based on the search input
function searchProducts() {
  const searchQuery = document.getElementById('searchInput').value.toLowerCase();
  const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery)
  );
  renderProducts(filteredProducts); // Render the filtered list of products
}

// Function to render products on the page
function renderProducts(filteredProducts = products) {
  const productSection = document.getElementById('productSection');
  productSection.innerHTML = ''; // Clear existing products
  filteredProducts.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');

      // Image slider code for each product
      const imagesSlider = product.images.map((image, index) => {
          return ` 
              <div class="slider-image" style="display: ${index === 0 ? 'block' : 'none'}">
                  <img src="${image}" alt="${product.name} Image ${index + 1}" width="100" height="100">
              </div>
          `;
      }).join('');

      productCard.innerHTML = `
          <div class="image-slider">
              ${imagesSlider}
              <button onclick="showNextImage(${product.id})">Next</button>
              <button onclick="showPreviousImage(${product.id})">Previous</button>
          </div>
          <h3>${product.name}</h3>
          <p>$${product.price}</p>
          <label for="quantity-${product.id}">Quantity:</label>
          <input type="number" id="quantity-${product.id}" value="1" min="1">
          <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      productSection.appendChild(productCard);
  });
}

// Function to start the speech recognition
// Function to filter and display products based on the search input
function searchProducts() {
  const searchQuery = document.getElementById('searchInput').value.toLowerCase();
  const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery)
  );
  renderProducts(filteredProducts); // Render the filtered list of products
}

// Function to render products on the page
function renderProducts(filteredProducts = products) {
  const productSection = document.getElementById('productSection');
  productSection.innerHTML = ''; // Clear existing products
  filteredProducts.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');

      // Image slider code for each product
      const imagesSlider = product.images.map((image, index) => {
          return ` 
              <div class="slider-image" style="display: ${index === 0 ? 'block' : 'none'}">
                  <img src="${image}" alt="${product.name} Image ${index + 1}" width="100" height="100">
              </div>
          `;
      }).join('');

      productCard.innerHTML = `
          <div class="image-slider">
              ${imagesSlider}
              <button onclick="showNextImage(${product.id})">Next</button>
              <button onclick="showPreviousImage(${product.id})">Previous</button>
          </div>
          <h3>${product.name}</h3>
          <p>$${product.price}</p>
          <label for="quantity-${product.id}">Quantity:</label>
          <input type="number" id="quantity-${product.id}" value="1" min="1">
          <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      productSection.appendChild(productCard);
  });
}

// Function to start the speech recognition
function startVoiceSearch() {
  // Check if browser supports SpeechRecognition
  if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert("Your browser doesn't support voice recognition.");
      return;
  }

  // Initialize SpeechRecognition
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US'; // Set the language for recognition
  recognition.interimResults = false; // Get final results only
  recognition.maxAlternatives = 1; // Limit the number of alternatives

  // Start the recognition process
  recognition.start();

  recognition.onstart = function () {
      console.log("Voice recognition started. Speak now!");
  };

  recognition.onspeechend = function () {
      console.log("Speech has ended.");
      recognition.stop();
  };

  recognition.onresult = function (event) {
      let transcript = event.results[0][0].transcript.toLowerCase(); // Get the voice input as text
      
      // Remove the period at the end of the transcript (if it exists)
      transcript = transcript.replace(/\.$/, ''); // This removes the period at the end
      
      document.getElementById('searchInput').value = transcript; // Set the input field to the recognized text
      searchProducts(); // Perform the search
  };

  recognition.onerror = function (event) {
      console.error("Speech recognition error:", event.error);
      alert("Error recognizing speech. Please try again.");
  };
}

// Add event listener to voice search button
document.getElementById('voiceSearchButton').addEventListener('click', startVoiceSearch);

////Light Section////

function toggleClassPlayer(){
  const body = document.querySelector('body');
  body.classList.toggle('lightStore');
}


/////Hide And Show //////

// Function to toggle the visibility of the cart
function toggleCartVisibility() {
  const cartSection = document.getElementById('cartSection');
  const toggleCartButton = document.getElementById('toggleCartButton');
  
  if (cartSection.style.display === 'none') {
      // Show the cart
      cartSection.style.display = 'block';
      toggleCartButton.textContent = 'Hide Cart';  // Change button text to "Hide Cart"
  } else {
      // Hide the cart
      cartSection.style.display = 'none';
      toggleCartButton.textContent = 'Show Cart';  // Change button text to "Show Cart"
  }
}
