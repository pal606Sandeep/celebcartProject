import { ConnectDB } from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
    try {
        await ConnectDB()
        const {userId, location} = await req.json()
        if (!userId || !location) {
            return NextResponse.json(
                {message:"Missing UserId and Location"},
                {status:400}
            )
        }
        const user = await User.findByIdAndUpdate(userId,{location})
        if (!user) {
            return NextResponse.json(
                {message:"user not found"},
                {status:400}
            )
        }

        return NextResponse.json(
            {message:"Location Updated"},
            {status:200}
        ) 
    } catch (error) {
        return NextResponse.json(
            {message:`update location error ${error}`},
            {status:500}
        )
    }
}