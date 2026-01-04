import { auth } from "@/auth";
import { ConnectDB } from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
try {
    await ConnectDB()
    const{role,mobileno} = await req.json()
    const session = await auth()
    const user  = await User.findOneAndUpdate({email:session?.user?.email},{role,mobileno},{new:true})
    if (!user) {
     return NextResponse.json(
        {message:"user not found"},
        {status:400}
     )
    }
    return NextResponse.json(
        user,
        {status:200}
    )
} catch (error) {
    return NextResponse.json(
        {message:"Edit Role and Mobile Error"},
        {status:500}
     )
    
}
}