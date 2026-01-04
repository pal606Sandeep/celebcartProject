import { auth } from "@/auth";
import { ConnectDB } from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
 try {
    await ConnectDB()
    const session = await auth()
    if (session?.user?.role!=="admin") {
        return NextResponse.json(
            {message:"You are not a admin"},
            {status:400}
            )
    }
    const {groceryId}= await req.json()
    const grocery = await Grocery.findByIdAndDelete(groceryId)
    return NextResponse.json(
        grocery,
        {status:200}
        )
 } catch (error) {
    console.error("SERVER ERROR DETAILS:", error)
     return NextResponse.json(
        {message:`Delete Grocery Error ${error}`},
        {status:500}
        )
 }
}