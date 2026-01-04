import mongoose,{Schema} from "mongoose";

export interface IUser{
    _id?:mongoose.Types.ObjectId
    name:string,
    email:string,
    password:string,
    mobileno?:string,
    role:"user" | "deliveryBoy" | "admin"
    image?:string
    location?: {
        type: {
            type: StringConstructor;
            enum: string[];
            default: string;
        };
        coordinates: {
            type: NumberConstructor[];
            default: number[];
        };
    }
    socketId:string | null
    isOnline:boolean
}

const userschema = new Schema<IUser>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    mobileno:{
        type:String
    },
    role:{
        type:String,
        enum:["user","deliveryBoy","admin"],
        default:"user"
    },
    image:{
        type:String, 
    },
    location:{
        type:{
            type:String,
            enum:["Point"],
            default:"Point"
        },
        coordinates:{
            type:[Number],
            default:[0,0]
        }
    },
    socketId:{
        type:String,
        default:null
    },
    isOnline:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

userschema.index({location:"2dsphere"})

const User = mongoose.models?.User || mongoose.model("User",userschema)

export default User