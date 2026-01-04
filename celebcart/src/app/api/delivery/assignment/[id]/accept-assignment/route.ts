import { auth } from "@/auth";
import { ConnectDB } from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { Order } from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest,context: { params: Promise<{ id: string; }>; }){
try {
    await ConnectDB()
    const {id} = await context.params
    const session = await auth()
    const deliveryBoyId = session?.user?.id
    if (!deliveryBoyId) {
        return NextResponse.json(
            {message:"Unauthorize"},
            {status:400}
        )
    }
    const assignment = await DeliveryAssignment.findById(id)
    if (!assignment) {
        return NextResponse.json(
            {message:"Assignment Not Found"},
            {status:400}
        )
    }
    if (assignment.status !== "brodcasted") {
        return NextResponse.json(
            {message:"Assignment Expire"},
            {status:400}
        )
    }
    const allreadyAssigned = await DeliveryAssignment.findOne(
        {   assignedTo:deliveryBoyId, 
            status:{$nin:["brodcasted","completed"]}
        })
    if (allreadyAssigned) {
        return NextResponse.json(
            {message:"All Ready Assigned"},
            {status:400}
        )
    }

    assignment.assignedTo = deliveryBoyId
    assignment.status = "assigned"
    assignment.acceptedAt = new Date()
    await assignment.save()

    const order = await Order.findById(assignment.order)
    if (!order) {
        return NextResponse.json(
            {message:"Order not found"},
            {status:400}
        )
    }
    order.assignedDeliveryBoy = deliveryBoyId
    await order.save()

    await order.populate("assignedDeliveryBoy")

    await emitEventHandler("order-assigned",{orderId:order._id,assignedDeliveryBoy:order.assignedDeliveryBoy})

    await DeliveryAssignment.updateMany(
        {_id:{$ne:assignment._id},
        brodCastedTo:deliveryBoyId,
        status:"brodcasted"
        },
        {
            $pull:{brodCastedTo:deliveryBoyId}
        }
        )

        return NextResponse.json(
            {message:"Order accepted Successfully"},
            {status:200}
        )
} catch (error) {
    return NextResponse.json(
        {message:`Order Accepted Error ${error}`},
        {status:500}
    )
}
}