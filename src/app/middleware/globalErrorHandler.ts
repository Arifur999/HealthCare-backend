import { NextFunction,  Request, Response } from "express";
import { env } from "../../config/env";
import status from "http-status";
import z from "zod";
import { IError, IErrorResponse } from "../interfaces/error.interfaces";
import { handleZodError } from "../errorHelpers/handleZodError";



// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const errorHandler = ((err:any, req:Request, res:Response,next:NextFunction)  => {
  console.error(err.stack);
if(env.NODE_ENV === "development "){
    console.log(err);
    
}



let errorSource : IError[] = [];
let statusCode : number=  status.INTERNAL_SERVER_ERROR;
let message : string= 'Something went wrong';


if (err instanceof z.ZodError) {
const simplifiedError = handleZodError(err);

statusCode = simplifiedError.statusCode as number;
message = simplifiedError.message;
errorSource=[...simplifiedError.errorSource];
}



const errorResponse : IErrorResponse = {
  success: false,
  message: message,
  errorSource: errorSource,
  error: env.NODE_ENV === "development" ? err : undefined,
}

  res.status(statusCode).json(errorResponse);
})