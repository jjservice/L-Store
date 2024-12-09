document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Stripe with your public key
    const stripe = Stripe('pk_live_51QTSb2LPa32ZluPp1YadZwNsFhMmn4a5u1sYzy0bgbIL1yD1LFuGXQcn3CgEBAwaBucY7RK5GwT51oEo44hDNbvo001nhm4Exe');
    
    // Set up Stripe Elements
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');

    const form = document.querySelector('#payment-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            // Call your backend to create a PaymentIntent
            const response = await fetch('/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentMethodType: 'card',
                    currency: 'USD',
                }),
            });

            // Check if the response is ok (status code 200-299)
            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            // Try to parse the JSON response
            const data = await response.json();

            // Check if the 'clientSecret' exists in the response
            if (!data.clientSecret) {
                throw new Error('Missing clientSecret in the response');
            }

            // Proceed with the payment confirmation
            const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (error) {
                addMessage(`Error: ${error.message}`);
            } else if (paymentIntent.status === 'succeeded') {
                addMessage('Payment succeeded!');
            }
        } catch (error) {
            addMessage(`Error: ${error.message}`);
        }
    });

    // Function to display messages
    const addMessage = (message) => {
        const messagesDiv = document.querySelector('#messages');
        messagesDiv.style.display = 'block';
        messagesDiv.innerHTML += `> ${message} <br>`;
        console.log('StripeSampleDebug', message);
    };
});


