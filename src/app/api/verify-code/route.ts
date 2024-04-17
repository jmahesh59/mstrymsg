import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { json } from "stream/consumers";


export async function POST(request :Request){

    await dbConnect();

    try {
        
     const {username , code} =   await request.json();

     const decodedusername = decodeURIComponent(username);

    const user = await UserModel.findOne({username:decodedusername});

    if(!user){
        return Response.json({
            success:false,
            message:"User not found"
        },{
            status:500
        })
    }

    const isCodeValid = user.verifyCode === code
    const isNotCodeExpired = new Date(user.verifyCodeExpiry) > new Date();

    if(isCodeValid && isNotCodeExpired){

        user.isVerified = true;
        await user.save();
        return Response.json({
            success:true,
            message:"Account Verified successfully"
        },{
            status:200
        })
    }else if(!isNotCodeExpired){
        return Response.json({
            success:false,
            message:"Verification coe vrifird please sign up again"
        },{
            status:400
        })
    }else{

        return Response.json({
            success:false,
            message:"Incorrect verificatio code"
        },{
            status:400
        })
    }


    } catch (error) {
        console.log("Error verifying user",error)
        return Response.json({
            success :false,
            message :"Error verifying user"
        },{status:500})
    }
}