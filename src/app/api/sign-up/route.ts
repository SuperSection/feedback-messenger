import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { sendVerificationEmail } from "@/services/sendVerificationEmail";


export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: true,
          message: "Username is already taken.",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email.",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryData = new Date();
      expiryData.setDate(expiryData.getHours() + 1);

      const newRegisteredUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryData,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newRegisteredUser.save();
    }

    // send verification email
    const verificationEmail = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!verificationEmail.success) {
      return Response.json(
        {
          success: false,
          message: verificationEmail.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
        verificationEmail,
      },
      { status: 201 }
    );

  } catch (error) {
    console.log("Error registering user", error);
    
    return Response.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}
