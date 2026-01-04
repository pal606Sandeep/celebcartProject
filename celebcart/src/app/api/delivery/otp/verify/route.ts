import { ConnectDB } from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { Order } from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    try {
        await ConnectDB()
        const {orderId, otp} = await req.json()
        if(!orderId || !otp){
            return NextResponse.json(
                {message:"orderId and otp not found"},
                {status:400}
             )
        }
        const order = await Order.findById(orderId)
        if (!orderId) {
            return NextResponse.json(
                {message:"Order not found"},
                {status:400}
             )
        }

        if (order.deliveryOtp!==otp) {
            return NextResponse.json(
                {message:"Incorrect or Expired Otp"},
                {status:400}
             )
        }
        order.status="delivered"
        order.deliveryOtpVerification=true
        order.deliveredAt = new Date()
        await order.save()
        await emitEventHandler("order-status-update",{orderId:order._id,status:order.status})

        await DeliveryAssignment.updateOne(
            {order:orderId},
            {$set:{assignedTo:null, status:"completed"}}
        )

        return NextResponse.json(
            {message:"Delivery Succesfully Completed"},
            {status:200}
         )
    } catch (error) {
        return NextResponse.json(
            {message:`Verify Otp error ${error}`},
            {status:500}
         )
    }
}