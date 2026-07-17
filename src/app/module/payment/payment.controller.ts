import status from "http-status";
import { sendResponse } from "../../shared/sendResponse.js";
import { PaymentService } from "./payment.service.js";
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import { env } from "../../../config/env.js";
import Stripe from "stripe";

const handleStripeWebhookEvent = catchAsync(async (req : Request, res : Response) => {
    const signature = req.headers['stripe-signature'] as string
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

    if(!signature || !webhookSecret){
        console.error("Missing Stripe signature or webhook secret");
        return res.status(status.BAD_REQUEST).json({message : "Missing Stripe signature or webhook secret"})
    }

    let event;

    try {
        event = Stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error : any) {
        console.error("Error processing Stripe webhook:", error);
        return res.status(status.BAD_REQUEST).json({message : "Error processing Stripe webhook"})
    }

    try {
        const result = await PaymentService.handlerStripeWebhookEvent(event);

        sendResponse(res, {
            httpStatus : status.OK,
            success : true,
            message : "Stripe webhook event processed successfully",
            data : result
        })
    } catch (error) {
        console.error("Error handling Stripe webhook event:", error);
        sendResponse(res, {
            httpStatus : status.INTERNAL_SERVER_ERROR,
            success : false,
            message : "Error handling Stripe webhook event"
        })
    }
})

const getAllPayments = catchAsync(async (req : Request, res : Response) => {
    const result = await PaymentService.getAllPayments();

    sendResponse(res, {
        httpStatus : status.OK,
        success : true,
        message : "Payments retrieved successfully",
        data : result
    })
})

export const PaymentController = {
    handleStripeWebhookEvent,
    getAllPayments,
}