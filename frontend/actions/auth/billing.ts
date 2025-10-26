"use server";

import { AxiosServerClient } from "@/lib/axiosServerClient";
import { handleAxiosError } from "@/lib/handleAxiosError";
import {TypeResponse} from "@/lib/types";
import {AxiosPublicClient} from "@/lib/axiosServerPublicClient";

export async function ensureStripeCustomer(userId: string): Promise<TypeResponse<{ stripeCustomerId: string }>> {

    try {
        const client = await AxiosPublicClient();

        const res = await client.post(`/billing/customers/ensure`, { userId });

        return {
            status: "success",
            message: "Stripe customer ok",
            data: { stripeCustomerId: res.data.stripeCustomerId },
        };
    } catch (error) {
        return handleAxiosError(error, "Impossible d’assurer le Stripe Customer " + userId );
    }
}

export async function startCourseCheckout(params: {
    userId: string;
    courseId: string;
    courseTitle: string;
    email: string;
    stripeCustomerId: string;
    amount: number;    // centimes
    currency: string;  // "eur"
}): Promise<TypeResponse<{ checkoutUrl: string }>> {
    try {
        console.log(
            "startCourseCheckout",
            params)
        const client = await AxiosServerClient();
        const res = await client.post(`/billing/checkout/course`, params);

        return {
            status: "success",
            message: "Session Stripe créée",
            data: { checkoutUrl: res.data.checkoutUrl },
        };
    } catch (error) {
        console.log(error);
        return handleAxiosError(error, "Impossible de démarrer le paiement");
    }
}