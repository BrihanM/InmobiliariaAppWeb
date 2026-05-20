import Stripe from 'stripe';
import { STRIPE_SECRET } from '../../config';

// Use a compatible API version for the installed Stripe SDK
const stripe = new Stripe(STRIPE_SECRET, { apiVersion: '2022-11-15' });

export default stripe;
