import { ConnectDB } from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import { Order } from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";


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

        await emitEventHandler("new-order",newOrder)

        return NextResponse.json(
            newOrder,
            {status:201}
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
            { message: `Place Order Error: An unexpected server error occurred.` },
            { status: 500 }
        );
    }
}