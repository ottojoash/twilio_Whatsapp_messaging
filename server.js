const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const twilio = require('twilio');

// Load environment variables from .env file
dotenv.config();

// Create the Express app
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);


// Enable CORS
app.use(cors());

// Define the WhatsApp route
app.post('/api/whatsapp', (req, res) => {
  console.log('Request received at /api/whatsapp');
  console.log('Request body:', req.body);

  const { paymentResponse, amount, email, name, phone } = req.body;
  console.log(paymentResponse,amount,email,name,phone);

  const twilioMessage = `Payment Response: ${paymentResponse}\nAmount: ${amount}\nEmail: ${email}\nName: ${name}\nPhone: ${phone}`;

  client.messages
    .create({
      from: 'whatsapp:+14155238886', // Your sandbox WhatsApp number
      body: twilioMessage,
      to: `whatsapp:+256761928218`
    })
    .then(message => {
      console.log(`Message sent. SID: ${message.sid}`);
      res.json({ success: true, message: 'WhatsApp message sent successfully' });
    })
    .catch(error => {
      console.error(`Error sending message: ${error}`);
      res.status(500).json({ success: false, message: 'Failed to send WhatsApp message' });
    });
});

// Start the server with regular HTTP
const port = process.env.PORT || 4000; // Use the provided port or default to 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
