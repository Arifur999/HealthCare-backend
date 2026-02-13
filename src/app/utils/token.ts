import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { env } from "../../config/env";
import { Response } from "express";
import { cookieUtils } from "./cookie";
// import ms, { StringValue } from "ms";

const getAccessToken=(payload: JwtPayload) => {
    const accessToken = jwtUtils.createToken(payload, env.ACCESS_TOKEN_SECRET,
         { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN } as SignOptions);
    return accessToken;
}

const getRefreshToken=(payload: JwtPayload) => {
    const refreshToken = jwtUtils.createToken(payload, env.REFRESH_TOKEN_SECRET,
         { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN } as SignOptions);
    return refreshToken;
}

const setAccessTokenCookie=(res:Response, token:string) => {
   
cookieUtils.setCookie(res, 'accessToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge:60 * 60 * 24, // 1 hour in milliseconds
});
}


const setRefreshTokenCookie=(res:Response, token:string) => {
    // const maxAge=ms(env.REFRESH_TOKEN_EXPIRES_IN as StringValue);
cookieUtils.setCookie(res, 'refreshToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 60 * 24 * 7, // 7 days in milliseconds
});
}


const BetterAuthSessionCookie = (res:Response, token:string) => {
    // const maxAge=ms(env.REFRESH_TOKEN_EXPIRES_IN as StringValue);
cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge:60 * 60 * 60 * 24 , // 1 day in milliseconds
});
}
   


export const tokenUtils = { getAccessToken, getRefreshToken, setAccessTokenCookie, setRefreshTokenCookie ,BetterAuthSessionCookie};