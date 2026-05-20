import Stripe from 'stripe';
import { STRIPE_SECRET } from '../../config';

/**
 * Proveedor de Stripe configurado con la clave privada.
 * La versión de la API se fija para mantener compatibilidad con tipos
 * y comportamiento del SDK usado en este proyecto.
 */
const stripe = new Stripe(STRIPE_SECRET, { apiVersion: '2022-11-15' });

export default stripe;
