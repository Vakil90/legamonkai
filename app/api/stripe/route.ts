import { MONTHLY_SUBSCRIPTION_FEE } from "@/constants";
import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const settingsUrl = absoluteUrl("/settings");
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const { userId } = auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userSubscription = await prisma.userSubscription.findUnique({
            where: {
                userId,
            },
        });

        if (userSubscription && userSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl,
            });

            return new NextResponse(JSON.stringify({ url: stripeSession.url }));
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: "USD",
                        product_data: {
                            name: "LegalMonk  Pro",
                            description: "Unilimited Generation and Access to Exclusive Features.",
                        },
                        unit_amount: MONTHLY_SUBSCRIPTION_FEE * 100,
                        recurring: {
                            interval: "month",
                        },
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId,
            },
        });

        return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    } catch (error) {
        console.log("[STRIPE_ERROR]", error);
        return new NextResponse("Internal Server error", { status: 500 });
    }
}
