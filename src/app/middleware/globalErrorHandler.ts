import { NextFunction,  Request, Response } from "express";
import { env } from "../../config/env";
import status from "http-status";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const errorHandler = ((err:any, req:Request, res:Response,next:NextFunction) => {
  console.error(err.stack);
if(env.NODE_ENV === "development "){
    console.log(err);
    // return res.status(500).json({
    //     success: false,
    //     message: err.message,
    //     error: err,
    //   });
}

const statusCode : number=  status.INTERNAL_SERVER_ERROR;
const message : string= 'Something went wrong';



  res.status(statusCode).json({
    success: false,
    message: message,
    error: err.message,
  });
})