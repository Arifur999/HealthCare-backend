import { NextFunction,  Request, Response } from "express";
import { env } from "../../config/env";
import status from "http-status";
import z from "zod";








interface IError {
  path: string;
  message: string;
  
}
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



    // error.issues; 
    /* [
      {
        expected: 'string',
        code: 'invalid_type',
        path: [ 'username' ],
        message: 'Invalid input: expected string'
      },
      {
        expected: 'number',
        code: 'invalid_type',
        path: [ 'xp' ],
        message: 'Invalid input: expected number'
      }
    ] */





const errorSource : IError[] = [];

let statusCode : number=  status.INTERNAL_SERVER_ERROR;
let message : string= 'Something went wrong';


if (err instanceof z.ZodError) {
statusCode = status.BAD_REQUEST;
message = "Validation failed";
err.issues.forEach((issue) => {

  errorSource.push({
    path:issue.path.length>1? issue.path.join('=>'): issue.path[0].toString(),
    message: issue.message,
  });
});

}



  res.status(statusCode).json({
    success: false,
    message: message,
    error: err.message,
    errorSource: errorSource,
  });
})