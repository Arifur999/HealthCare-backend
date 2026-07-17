import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt.js";
import { env } from "../../config/env.js";
import { Response } from "express";
import { cookieUtils } from "./cookie.js";
import ms, { StringValue } from "ms";

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
    maxAge: ms(env.ACCESS_TOKEN_EXPIRES_IN as StringValue),
});
}


const setRefreshTokenCookie=(res:Response, token:string) => {
cookieUtils.setCookie(res, 'refreshToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: ms(env.REFRESH_TOKEN_EXPIRES_IN as StringValue),
});
}


const setBetterAuthSessionCookie = (res:Response, token:string) => {
cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: ms(env.ACCESS_TOKEN_EXPIRES_IN as StringValue),
});
}
   


export const tokenUtils = { getAccessToken, getRefreshToken, setAccessTokenCookie, setRefreshTokenCookie, setBetterAuthSessionCookie };
