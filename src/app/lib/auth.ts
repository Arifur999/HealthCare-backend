import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";
import { env } from "../../config/env";

// import ms, { StringValue } from "ms";
// import { env } from "../../config/env";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification:true,
  },

socialProviders: {
  google: {
    enabled: true,
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    

    mapProfileToUser() {
      return {
        role: Role.PATIENT,
        status: UserStatus.ACTIVE,
        needPasswordChange: false,
        emailVerified: true,
        isDeleted: false,
        deletedAt: null,
      }
    },
   
  },
},





emailVerification:{
  sendOnSignUp:true,
sendOnSignIn:true,
autoSignInAfterVerification:true,
},




  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.PATIENT,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
        needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
        isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
        deletedAt: {
        type: "date",
        required: false,
        defaultValue: null,
      },
    },
  },

plugins:[
  bearer(),
  emailOTP({
    overrideDefaultEmailVerification:true,
    async sendVerificationOTP({email,otp,type}){
      if(type === "email-verification"){
        const user =await prisma.user.findUnique({
          where:{
            email,
          },
        })

if(user&&!user.emailVerified){
  sendEmail({
    to:email,
    subject:"verify your email",
    templateName:"otp",
    templateDate:{
      name:user.name,
      otp,
    },
  })
}

      }else if(type === "forget-password"){
        const user =await prisma.user.findUnique({
          where:{
            email,
          },
        })

        if(user){
          sendEmail({
            to:email,
            subject:"password reset OTP",
            templateName:"otp",
            templateDate:{
              name:user.name,
              otp,
            },
          })
        }

      }
    },

    expiresIn:2*60,
    otpLength:6,

  })
],



  session: {
    expiresIn:60 * 60 * 24, // Session expiration time (1 day in seconds)
 updateAge: 60 * 60 * 24, // Time after which the session token should be updated (1 day in seconds)
  cookieCache: {
    enabled: true,
    maxAge: 60 * 60 * 24 , // Cache duration for session cookies (1 day in seconds)
  },

},
 
redirectURLs:{
signIn:`${env.BETTER_AUTH_URL}/api/v1/auth/google/success`,

},

  trustedOrigins: [ process.env.BETTER_AUTH_URL ||"http://localhost:5000",env.FRONTEND_URL],
  advanced: {
    // disableCSRFCheck: true,
    useSecureCookies:false,
    cookies:{
      state:{
        attributes:{
          sameSite:"none",
          secure:true,
          httpOnly:true,
        }
      },
      sessionToken:{
        attributes:{
          sameSite:"none",
          secure:true,
          httpOnly:true,
        }
      }
    }
  },
});
