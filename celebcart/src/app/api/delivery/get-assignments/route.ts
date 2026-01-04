import { auth } from "@/auth";
import { ConnectDB } from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { NextRequest, NextResponse } from "next/server";
import {Order} from "@/models/order.model";


export async function GET(req:NextRequest){
    try {
        await ConnectDB()
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const orderModel = Order;
        const assignments = await DeliveryAssignment.find({
            brodCastedTo:session?.user?.id,
            status:"brodcasted"
        }).populate("order")
        return NextResponse.json(
            assignments,{status:200}
        )
    } catch (error) {
        return NextResponse.json(
           {message:`Get assignments error ${error}`},
           {status:500}
        )
    }
}