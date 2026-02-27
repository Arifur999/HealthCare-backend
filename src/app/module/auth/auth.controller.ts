import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { env } from "../../../config/env";
import ms, { StringValue } from "ms";
import AppError from "../../errorHelpers/AppError";
import { cookieUtils } from "../../utils/cookie";
import { auth } from "../../lib/auth";




const registerPatient = catchAsync(
    async (req: Request, res: Response) => {
        const maxAge = ms(env.ACCESS_TOKEN_EXPIRES_IN as StringValue);
        console.log({ maxAge });
        const payload = req.body;

        console.log(payload);

        const result = await authService.registerPatient(payload);

        const { accessToken, refreshToken, token, ...rest } = result

        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token as string);

        sendResponse(res, {
            httpStatus: status.CREATED,
            success: true,
            message: "Patient registered successfully",
            data: {
                token,
                accessToken,
                refreshToken,
                ...rest,
            }
        })
    }
)

const loginUser = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await authService.loginUser(payload);
        const { accessToken, refreshToken, token, ...rest } = result

        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token);

        sendResponse(res, {
            httpStatus: status.OK,
            success: true,
            message: "User logged in successfully",
            data: {
                token,
                accessToken,
                refreshToken,
                ...rest,

            },
        })
    }
)

const getMe = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user;
        console.log({user});
        const result = await authService.getMe(user);
        sendResponse(res, {
            httpStatus: status.OK,
            success: true,
            message: "User profile fetched successfully",
            data: result,
        })
    }
)

const getNewToken = catchAsync(
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        const betterAuthSessionToken = req.cookies["better-auth.session_token"];
        if (!refreshToken) {
            throw new AppError(status.UNAUTHORIZED, "Refresh token is missing");
        }
        const result = await authService.getNewToken(refreshToken, betterAuthSessionToken);

        const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;

        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

        sendResponse(res, {
            httpStatus: status.OK,
            success: true,
            message: "New tokens generated successfully",
            data: {
                accessToken,
                refreshToken: newRefreshToken,
                sessionToken,
            },
        });
    }
)


const changePassword = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const betterAuthSessionToken = req.cookies["better-auth.session_token"];

        const result = await authService.changePassword(payload, betterAuthSessionToken);

        const { accessToken, refreshToken, token } = result;

        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token as string);

        sendResponse(res, {
            httpStatus: status.OK,
            success: true,
            message: "Password changed successfully",
            data: result,
        });
    }
)

const logoutUser = catchAsync(
    async (req: Request, res: Response) => {
        const betterAuthSessionToken = req.cookies["better-auth.session_token"];
        const result = await authService.logoutUser(betterAuthSessionToken);
        cookieUtils.clearCookie(res, 'accessToken', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        cookieUtils.clearCookie(res, 'refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        cookieUtils.clearCookie(res, 'better-auth.session_token', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        sendResponse(res, {
            httpStatus: status.OK,
            success: true,
            message: "User logged out successfully",
            data: result,
        });
    }
)


const verifyEmail = catchAsync(
    async (req: Request, res: Response) => {
        const { email, otp } = req.body;
         await authService.verifyEmail(email, otp);
        sendResponse(res, {
            httpStatus: status.OK,
            success: true,
            message: "Email verified successfully",
          
        });
    }
)

const forgetPassword = catchAsync(
    async (req: Request, res: Response) => {
        const { email } = req.body;
        await authService.forgetPassword(email);
        sendResponse(res, {
            httpStatus: status.OK,
            success: true,
            message: "Password reset email sent successfully",
          
        });
    }
)

const resetPassword = catchAsync(
    async (req: Request, res: Response) => {
        const { email, otp, newPassword } = req.body;
        await authService.resetPassword(email, otp, newPassword);
        sendResponse(res,{
            httpStatus: status.OK,
            success: true,
            message: "Password reset successfully",
          
        });
    
        })


        //  /api/v1/auth/login/google?redirect=/profile
const googleLogin = catchAsync(
    async (req: Request, res: Response) => {

        const redirectUrl = req.query.redirect || "/dashboard";
        const encodeRedirectPath = encodeURIComponent(redirectUrl as string);
        const callbackURL = `${env.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodeRedirectPath}`;
        res.render("googleRedirect",{
            callbackURL,
            betterAuthUrl: env.BETTER_AUTH_URL,
        })
        
        
     })   
    


const googleLoginSuccess = catchAsync(
    async (req: Request, res: Response) => {
        const redirectUrl = req.query.redirect as string|| "/dashboard";
        const sessionPath = req.cookies["better-auth.session_token"];

        if(!sessionPath){
            return res.redirect(`${env.FRONTEND_URL}/login?error=oauth_failed`)
        }
        const session= await auth.api.getSession({
            headers : {
                "Cookie" : `better-auth.session_token=${sessionPath}`
            
            }
        })


        if(!session){
            return res.redirect(`${env.FRONTEND_URL}/login?error=no_session_found`)

        }

        if(session && !session.user){
            return res.redirect(`${env.FRONTEND_URL}/login?error=no_user_found`)

        }

        const result =await authService.googleLoginSuccess(session);

        const { accessToken, refreshToken} = result;
        tokenUtils.setAccessTokenCookie(res,accessToken);
        tokenUtils.setRefreshTokenCookie(res,refreshToken);
        
        const isValidRedirectPath=redirectUrl.startsWith("/") && !redirectUrl.startsWith("//");
        const finalRedirectUrl = isValidRedirectPath ?  redirectUrl :"/dashboard";
         res.redirect(`${env.FRONTEND_URL}${finalRedirectUrl}`)
        


    })


const handleOAuthError = catchAsync(
    async (req: Request, res: Response) => {
        const error = req.query.error as string || "oauth_failed";
         res.redirect(`${env.FRONTEND_URL}/login?error=${error}`)
        

    })


export const authController = {
  registerPatient,
  loginUser,
  getMe,
  getNewToken,
  changePassword,
logoutUser,
verifyEmail,
forgetPassword,
resetPassword,
googleLogin,
googleLoginSuccess,
handleOAuthError,
};