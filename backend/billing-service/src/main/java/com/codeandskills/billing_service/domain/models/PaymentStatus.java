package com.codeandskills.billing_service.domain.models;

public enum PaymentStatus {

    /**
     * Paiement créé mais pas encore finalisé (session Checkout ouverte, attente d'action de l'utilisateur)
     */
    PENDING,

    /**
     * Paiement autorisé mais pas encore capturé (optionnel selon le mode)
     */
    AUTHORIZED,

    /**
     * Paiement capturé / validé avec succès.
     * → Correspond à Stripe: payment_intent.succeeded / checkout.session.completed
     * → Correspond à PayPal: COMPLETED
     */
    PAID,

    /**
     * Paiement refusé, annulé ou échoué.
     * → Correspond à Stripe: payment_intent.payment_failed
     * → Correspond à PayPal: FAILED / DENIED
     */
    FAILED,

    /**
     * Paiement remboursé partiellement ou totalement.
     */
    REFUNDED,

    /**
     * Paiement annulé avant validation (Checkout expiré, abandon utilisateur, etc.)
     */
    CANCELED
}
