import mongoose from "mongoose";


export interface IMessage{
    _id?:mongoose.Types.ObjectId
    roomId:mongoose.Types.ObjectId
    text:string
    senderId:mongoose.Types.ObjectId
    time:string
    createdAt?:Date
    updatedAt?:Date
}

const messageSchmea = new mongoose.Schema<IMessage>({
    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    },
    text:{
        type:String
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    time:{
        type:String
    }
},{timestamps:true})

const Message = mongoose.models.Message || mongoose.model("Message", messageSchmea)

export default Message