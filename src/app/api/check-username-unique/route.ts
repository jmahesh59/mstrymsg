import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod';

import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request :Request){


    await dbConnect();

    try {

        const {searchParams} = new URL(request.url);

        const queryParam = {
            username :searchParams.get('username')
        }

        //validate with zod

       const result = UsernameQuerySchema.safeParse(queryParam)

       console.log(result);

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []

            return Response.json({
                success :false,
                message: usernameErrors.join?.length > 0 ?usernameErrors.join(', '):'Invalid query parameters'
            },{status:400})
        }

        const {username} = result.data;
        const existingVerifiedUsername = await UserModel.findOne({username,isValid:true});

        if(existingVerifiedUsername){
            
            return Response.json({
                success:false,
                message:"Error checking username"
            })
        }
        
    } catch (error) {
        console.log("Error checking username",error)
        return Response.json({
            success :false,
            message :"Error checking username"
        },{status:500})
    }
}
