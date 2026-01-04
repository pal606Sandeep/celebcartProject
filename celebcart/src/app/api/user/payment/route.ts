import { ConnectDB } from "@/lib/db";
import { Order } from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req:NextRequest){
    try {
        await ConnectDB()
        const{userId, items, paymentMethod, totalAmount, address } = await req.json()
        if (!userId || !items || !paymentMethod || !totalAmount || !address) {
            return NextResponse.json(
                {message:"Please Send All Credentials"},
                {status:400}
            )
        }
        const user = await User.findById(userId)
        if (!user) {
            return NextResponse.json(
                {message:"User Not Found"},
                {status:400}
            )
        }
        const newOrder = await Order.create({
            user:userId,
            items,
            paymentMethod, 
            totalAmount, 
            address
        })

        const session = stripe.checkout.sessions.create({
            payment_method_types:["card"],
            mode:"payment",
            success_url:`${process.env.NEXT_BASE_URL}/user/order-success`,
            cancel_url:`${process.env.NEXT_BASE_URL}/user/order-cancel`,
            line_items:[
                {
                    price_data:{
                        currency:'inr',
                        product_data:{
                            name:'CelebCart Order Payment',
                        },
                        unit_amount:totalAmount*100,
                    },
                    quantity:1,
                }
            ],
            metadata:{orderId:newOrder._id.toString()}
        })

        return NextResponse.json(
            {url:(await session).url},
            {status:200}
            )
    } catch (error: any) {
        console.error("ORDER PLACEMENT ERROR:", error);

        // FIX: Check for Mongoose Validation Errors
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { message: `Validation Failed: ${error.message}` },
                { status: 422 } // <-- Return 422 Unprocessable Entity
            );
        }
        
        // Fallback for unexpected 500 errors (DB connection loss, etc.)
        return NextResponse.json(
            { message: ` Order Payment Error: An unexpected server error occurred.` },
            { status: 500 }
        );
    }
}