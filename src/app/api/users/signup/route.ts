import { dbConnect } from "@/dbconnect/dbconnect";
import User from "@/models/user.model.js";
import { NextRequest, NextResponse } from "next/server"
import bycrpt from "bcrypt"
import { sendMail } from "@/helper/mailer";
dbConnect();

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json()
        const { username, email, password } = reqBody

        if ([username, email, password].some(item => item === null || undefined) && password.length >= 8) {
            return NextResponse.json({ error: "all fields required" }, { status: 401 })
        }

        const usercheck = await User.findOne({ email });

        if (usercheck) {
            return NextResponse.json({ error: "user already exist with this email address" }, { status: 400 })

        }
        const salt = await bycrpt.genSalt(10)
        const hashpassword = await bycrpt.hash(password, salt)

        const newUser = await User.create({
            username,
            email,
            password: hashpassword,
        })

        const saveUser = await newUser.save()
        console.log(saveUser);
         
        await sendMail({email, emailType:"VERIFY", userId : saveUser._id.toString()})
        
        return NextResponse.json({ 
            message: "user created successfully",
            status: 201,
            saveUser
        }, { status: 201 })
           
    } catch (error: any) {
        return NextResponse.json({ error: error.message })
    }
}