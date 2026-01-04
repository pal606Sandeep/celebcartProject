import { ConnectDB } from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    try {
        await ConnectDB()

        const {name,email,password,role} = await req.json()
        const existUser = await User.findOne({email})
        if (existUser) {
            return NextResponse.json(
                {message:"Email is already Use!"},
                {status:400}
            )
        }
        if (password.length<8) {
            return NextResponse.json(
                {message:"Password must be greater than 8 digit"},
                {status:400}
            )
        }

        const hashPassword =await bcrypt.hash(password,10)

        const user = await User.create({name,email,password:hashPassword,role:role})
        return NextResponse.json(
            user,
            {status:200}
        )
    } catch (error) {
        return NextResponse.json(
            {message:`register error ${error}`},
            {status:500}
        )
    }
}