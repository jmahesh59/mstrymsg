import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt  from 'bcryptjs';
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export  async function POST(request:Request){

    await dbConnect();

    try {

        const {username , email , password} = await request.json();

       const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified :true
        })

        if(existingUserVerifiedByUsername){
            return Response.json({
                success :false,
                message : "Username already taken",
            },{status:400})
        }

        const existingUserByEmail = await UserModel.findOne({email});

        const verifyCode = Math.floor(100000 + Math.random()*9000).toString();


        if(existingUserByEmail){

            if(existingUserByEmail.isVerified){

                return Response.json({
                    success : false,
                    message: "User already exist with this email"
                },{status:200})
            }else{

                const hashPassword = await bcrypt.hash(password ,10);

                existingUserByEmail.password = hashPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

                await existingUserByEmail.save();
            }
            
        }else{

            const hashPassword = await bcrypt.hash(password ,10);

            const expiryDate = new Date();

            expiryDate.setHours(expiryDate.getHours()+1)

             const newUser = new  UserModel({
                username ,
                email ,
                password : hashPassword,
                verifyCode,
                verifyCodeExpiry : expiryDate,
                isVerified : false ,
                isAcceptingMessage : true,
                messages : [] 
             }) 

             await newUser.save();
        }


        // send verification Email;

         const emailResopnce =  await sendVerificationEmail(email , username , verifyCode)

         if(!emailResopnce.sucess){
            
            return Response.json({
                success :false,
                message : emailResopnce.message,
            },{status:500})
         }

        return Response.json({
            succes :true,
            message: "user register sucessfully. please verify your email"
        },{status:201})

    } catch (error) {
        console.log("Error registering user",error);

        return Response.json({
            success :false,
            message:"Error registering user"
        },{ status :500})
    }
    
}
