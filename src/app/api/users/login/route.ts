import { dbConnect } from "@/dbconnect/dbconnect";
import User from "@/models/user.model.js";
import { NextRequest, NextResponse } from "next/server"
import bycrpt from "bcrypt"
import jwt from "jsonwebtoken"

dbConnect()
export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json()
        const { email, password } = reqBody

        if (!email || !password && password.length < 8) {
            return NextResponse.json({ error: "email and password is required" })
        }

        const usercheck = await User.findOne({ email })

        if (!usercheck) {
            return NextResponse.json({ error: "user doesn't exist with this email address" })
        }

        const verifypassword: any = await bycrpt.compare(password, usercheck.password)
        console.log("the verifypassword type : ", typeof (verifypassword));

        if (!verifypassword) {
            return NextResponse.json({ error: "password is incorrect" })
        }

        const tokenData = {
            id: usercheck._id   
        }
        const TOKEN_SECRET = process.env.MONGODB_URL;
        if (!TOKEN_SECRET) {
            throw new Error('Please define the MONGODB_URL environment variable');
        }
        const token = jwt.sign(tokenData, TOKEN_SECRET, { expiresIn: "1d" })

        const respones = NextResponse.json({
            message: "user login successfully",
            status: 201,
            usercheck
        }, { status: 201 })


        respones.cookies.set("token", token, { httpOnly: true, secure: false })
        return respones
    }
    catch (error: any) {
        return NextResponse.json({ error: error.message })
    }
}