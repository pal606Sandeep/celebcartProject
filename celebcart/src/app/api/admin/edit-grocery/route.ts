import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
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
    const formData = await req.formData()
    const name = formData.get("name") as string
    const groceryId = formData.get("groceryId") as string
    const category = formData.get("category") as string
    const unit = formData.get("unit") as string
    const price = formData.get("price") as string | null
    const file = formData.get("image") as Blob | null
    let imageUrl
    if (file) {
        imageUrl = await uploadOnCloudinary(file)
    }
    const grocery = await Grocery.findByIdAndUpdate(groceryId,
        {
            name, category, unit, price, image:imageUrl
        }
    )
    return NextResponse.json(
        grocery,
        {status:200}
        )
 } catch (error) {
    console.error("SERVER ERROR DETAILS:", error)
     return NextResponse.json(
        {message:`Edit Grocery Error ${error}`},
        {status:500}
        )
 }
}

