import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/verificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email:string,username:string,verifyCode:string):Promise<ApiResponse>{

    try {
        
    await resend.emails.send({
     from: 'onboarding@resend.dev',
     to: email,
     subject: 'Mystry message | verification code',
     react: VerificationEmail({username ,otp:verifyCode}),
  });
        return {sucess :true ,message:" Verification Email send successfully"}
    } catch (error) {
        console.error("Error sending verification email",error);
        return {sucess :false ,message:"fail to send verificationemail"}
    }
}
