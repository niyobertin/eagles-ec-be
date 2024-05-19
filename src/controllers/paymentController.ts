import { Request, Response } from "express";
import { getOrCreateCustomer, makeLineItems, placeOrder } from "../services/payment.service";
import { clearCart, viewCart } from "../services/cart.service";
import { findUserById } from "../services/user.service";
import * as mailService from "../services/mail.service";
import { SUBJECTS } from "../types";
import { confirmPayment } from "../email-templates/confirmPayment";
import stripe from "../config/stripe";
import dotenv from "dotenv";
dotenv.config()

const BASE_URL = process.env.IS_REMOTE === "true" ? process.env.REMOTE_URL : `http://localhost:${process.env.PORT}`;

export const createCheckoutSession = async (req: Request, res: Response) => {
    const user: any = req.user;
    try {
        //@ts-ignore
        const cart = req.cart;
        const line_items = makeLineItems(cart.userCart);
        const customer = await getOrCreateCustomer(user);
        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            customer: customer.id,
            success_url: `${BASE_URL}/api/v1/payment/success?sessionId={CHECKOUT_SESSION_ID}&userId=${user.id}`,
            cancel_url: `${BASE_URL}/api/v1/payment/canceled`,
        });
        return res.status(200).json({
            message: "payment session created!",
            sessionUrl: session.url
        });
    } catch (err: any) {
        return res.status(500).json({
            message: err.message
        })
    }

};

export const handleSuccess = async (req: Request, res: Response) => {
    try {
        const { userId, sessionId } = req.query as { userId: string, sessionId: string }
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const user: any = await findUserById(userId);
        const cart: any = await viewCart(user);
        if (session.payment_status === "paid") {
            const order = await placeOrder(cart);
            await clearCart(user);
            await mailService.sendEmailService(user, SUBJECTS.PAYMENT_CONFIRMATION, confirmPayment(user, order));
            return res.status(200).json({
                message: "you have successfully paid your products",
                order
            });
        }
    } catch (err: any) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export const handleFailure = async (req: Request, res: Response) => {
    return res.status(500).json({ message: "Your payment has failed!" })
}