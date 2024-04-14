import { resend } from "@/lib/resend";
import { ApiResponse } from '@/types/ApiResponse';
import VerificationEmail from "../../emails/VerificationEmail";


export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboardinh@resend.dev",
      to: email,
      subject: "Feedback Messenger | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
      
    return {
      success: true,
      message: "Verification email send successfully",
    };
      
  } catch (emailError) {
    console.log("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verifiaction email" };
  }
}


