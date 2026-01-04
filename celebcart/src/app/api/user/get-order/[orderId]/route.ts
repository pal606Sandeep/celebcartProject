import { ConnectDB } from "@/lib/db";
import { Order } from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,context: { params: Promise<{ orderId: string; }>; }){
try {
    await ConnectDB()
    const {orderId} = await context.params
    console.log(orderId)
    const order = await Order.findById(orderId).populate("assignedDeliveryBoy")
    if (!order) {
        return NextResponse.json(
            {message:"Order NOt Found"},
            {status:400}
        )
    }
    return NextResponse.json(
        // {message:"Order Found"},
        order,
        {status:200}
    )
} catch (error) {
    return NextResponse.json(
        {message:`get order by Id error ${error}`},
        {status:500}
    )
}
}