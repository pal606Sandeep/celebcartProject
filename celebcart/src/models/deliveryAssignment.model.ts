import mongoose  from "mongoose";



export interface IDeliveryAssignment{
    _id?:mongoose.Types.ObjectId
    order:mongoose.Types.ObjectId
    brodCastedTo:mongoose.Types.ObjectId[]
    assignedTo:mongoose.Types.ObjectId 
    status:"brodcasted" | "assigned" | "completed"
    acceptedAt:Date
    createdAt?:Date
    updatedAt?:Date
}

const deliveryAssignmentSchema = new mongoose.Schema<IDeliveryAssignment>({
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    },
    brodCastedTo:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
    ],
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        enum:["brodcasted", "assigned", "completed"],
        default:"brodcasted"
    },
    acceptedAt:{
        type:Date
    }
},{timestamps:true})

const DeliveryAssignment = mongoose.models.DeliveryAssignment || mongoose.model("DeliveryAssignment",deliveryAssignmentSchema)

export default DeliveryAssignment

