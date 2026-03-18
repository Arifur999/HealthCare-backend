import dotenv from "dotenv";
import AppError from "../app/errorHelpers/AppError";
import status from "http-status";

dotenv.config();

interface ENVConfig {
    NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
  BETTER_AUTH_SESSION_EXPIRATION: string;
  BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: string;
EMAIL_SENDER:{
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_FROM: string;
}


GOOGLE_CLIENT_ID: string;
GOOGLE_CLIENT_SECRET: string;
CALLBACK_URL: string;
FRONTEND_URL: string;

CLOUDINARY_CLOUD_NAME: string;
CLOUDINARY_API_KEY: string;
CLOUDINARY_API_SECRET: string;

STRIPE_SECRET_KEY: string;
STRIPE_PUBLISHABLE_KEY: string;
STRIPE_WEBHOOK_SECRET: string;

SUPER_ADMIN_EMAIL: string;
SUPER_ADMIN_PASSWORD: string;

}

const loadEnv = (): ENVConfig => {

    const requiredEnvVars = [
        "NODE_ENV",
        "PORT",
        "DATABASE_URL",
        "BETTER_AUTH_SECRET",
        "BETTER_AUTH_URL",
        "ACCESS_TOKEN_SECRET",
        "REFRESH_TOKEN_SECRET",
        "ACCESS_TOKEN_EXPIRES_IN",
        "REFRESH_TOKEN_EXPIRES_IN",
        "BETTER_AUTH_SESSION_EXPIRATION",
        "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
        "EMAIL_SENDER_SMTP_USER",
        "EMAIL_SENDER_SMTP_PASS",
        "EMAIL_SENDER_SMTP_HOST",
        "EMAIL_SENDER_SMTP_PORT",
        "EMAIL_SENDER_SMTP_FROM",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "CALLBACK_URL",
        "FRONTEND_URL",
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
        "STRIPE_SECRET_KEY",
        "STRIPE_PUBLISHABLE_KEY",
        "STRIPE_WEBHOOK_SECRET",
        "SUPER_ADMIN_EMAIL",+
        "SUPER_ADMIN_PASSWORD",

      ];

      requiredEnvVars.forEach((varName) => {
        if (!process.env[varName]) {
          throw new AppError(status.INTERNAL_SERVER_ERROR, `Environment variable ${varName} is not set`);
        }
      });

   
  return {
    NODE_ENV: process.env.NODE_ENV as string,
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
    BETTER_AUTH_SESSION_EXPIRATION: process.env.BETTER_AUTH_SESSION_EXPIRATION as string,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as string,
    EMAIL_SENDER:{
      SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER as string,
      SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS as string,
      SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST as string,
      SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT as string,
      SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM as string,
    },
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    CALLBACK_URL: process.env.CALLBACK_URL as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string, 
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY as string,  
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,

  }
};

export default loadEnv;


export const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "your_better_auth_secret",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "your_access_token_secret",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret",
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "1d",
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  BETTER_AUTH_SESSION_EXPIRATION: process.env.BETTER_AUTH_SESSION_EXPIRATION || "7d",
  BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE || "1d",
  EMAIL_SENDER:{
    SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER || "",
    SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS || "",
    SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST || "",
    SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT || "",
    SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM || "",
  },
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  CALLBACK_URL: process.env.CALLBACK_URL || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string ,
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,


};