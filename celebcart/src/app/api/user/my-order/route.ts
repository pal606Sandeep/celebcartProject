import { auth } from "@/auth";
import { ConnectDB } from "@/lib/db";
import { Order } from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest){
    try {
        await ConnectDB()
        const session = await auth()
        const orders = await Order.find({user:session?.user?.id}).populate("user assignedDeliveryBoy").sort({createdAt:-1})
        if (!orders) {
            return NextResponse.json(
                {message:"Orders Not found"},
                {status:400}
            )
        }
        return NextResponse.json(
            orders,
            {status:200}
        )
    } catch (error) {
        return NextResponse.json(
            {message:`Get all orders error:${error}`},
            {status:200}
            )
        
    }
}