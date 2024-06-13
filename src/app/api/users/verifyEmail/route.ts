import { dbConnect } from "@/dbconnect/dbconnect";
import User from "@/models/user.model.js";
import { NextRequest, NextResponse } from "next/server"

dbConnect();

export async function POST(req:NextRequest){
    try {
        const reqBody = await req.json()
        const { token } = reqBody
        console.log("checking the token: ", token);

        return await User.findOne({verifyToken: token, verifyTokenExpeiry: {$gt: Date.now()}})
        .then(async (user) => {
            if (!user) {
                return NextResponse.json({error: "Token is invalid or expired"}, {status: 401})
            }
            user.isVerified = true
            user.verifyToken = undefined
            user.verifyTokenExpeiry = undefined
            await  user.save()
            
            // await User.findByIdAndUpdate(user._id, {isVerified: true, verifyToken: undefined, verifyTokenExpeiry: undefined})
            return NextResponse.json({message: "Email verified successfully"}, {status: 200})
        })
        .catch((error) => {
            return NextResponse.json({error: error.message}, {status: 401})
        }) 
               
    } catch (error: any) {
        return NextResponse.json({ error: error.message })
    }
}