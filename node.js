const express = require('express');
const stripe = require('stripe')('sk_live_...zVj4');  // Replace with your actual secret key
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Endpoint to create the Stripe Checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;

  try {
    // Create a Checkout Session with the items
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items,
      mode: 'payment',
      success_url: `${process.env.HOST_URL}/success?session_id={CHECKOUT_SESSION_ID}`,  // Modify success URL as needed
      cancel_url: `${process.env.HOST_URL}/cancel`,  // Modify cancel URL as needed
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

require('dotenv').config();


