import Stripe from "stripe";
import { env } from "../utils/env";

const stripe = new Stripe(env.stripe_secret);

export default stripe;