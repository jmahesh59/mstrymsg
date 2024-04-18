import { getServerSession } from "next-auth";
import { authOptions } from "../sign-up/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from 'next-auth';


export async function POST(request:Request){

    await dbConnect();

    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || !session.user ){
        return Response.json({
            success:false,
            message:"Not autheticated"
        },{status:500})
    }

    const userId = user._id 
    const {acceptMessages} = await request.json();

    try {
        
       const updatedUser = await UserModel.findByIdAndUpdate(userId ,{
            isAcceptingMessage:acceptMessages
        },{new:true});


        if(!updatedUser){
            return Response.json({
                success:false,
                message:"Fail to update user status to accept message"
            },{status:401})
        }

        return Response.json({
            success:true,
            message:"message user status updated successfully",
            updatedUser
        },{status:200})


    } catch (error) {
        return Response.json({
            success:false,
            message:"failed to update user status to accept message"
        },{status:500})
    }
}

export async function GET(request:Request){

    await dbConnect();

    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || !session.user ){
        return Response.json({
            success:false,
            message:"Not autheticated"
        },{status:500})
    }

    const userId = user._id 

try {
       const foundUser = await UserModel.findById(userId);
    
       if(!foundUser){
        return Response.json({
            success:false,
            message:"User not found"
        },{status:401})
    }
    
        return Response.json({
            success:true,
            isAcceptingMessages:foundUser.isAcceptingMessage,
            
        },{status:200})
} catch (error) {
    return Response.json({
        success:false,
        message:"Error in getting message accepting status"
    },{status:500})
}

}