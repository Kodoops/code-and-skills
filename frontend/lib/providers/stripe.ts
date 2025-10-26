import "server-only";

import  Stripe from "stripe";
import { env } from "../env";

// export const stripe = new Stripe(env.STRIPE_SECRET_KEY,{
//     apiVersion: "2024-06-20" as Stripe.LatestApiVersion, // "2025-08-27.basil",
//     typescript: true,
// });

export const stripe = new Stripe(env.STRIPE_SECRET_KEY,{
    typescript: true,
    apiVersion: "2024-06-20" as Stripe.LatestApiVersion,
});
