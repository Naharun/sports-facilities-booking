import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-10-28.acacia', // Ensure this matches the required version
});

export default stripe;
