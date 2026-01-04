import { ConnectDB } from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";


export async function GET(){
    try {
        await ConnectDB()
        const user = await User.find({role:"admin"})
        if (user.length>0) {
            return NextResponse.json(
                {adminExist:true},
                {status:200}
            )
        } else {
            return NextResponse.json(
                {adminExist:false},
                {status:200}
            )
        }
    } catch (error) {
        return NextResponse.json(
            { message: `Check for admin Error: ${error instanceof Error ? error.message : error}` },
            { status: 500 }
        )
    }
}