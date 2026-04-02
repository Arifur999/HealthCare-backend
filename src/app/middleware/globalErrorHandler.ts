import { NextFunction,  Request, Response } from "express";
import { env } from "../../config/env";
import status from "http-status";
import z from "zod";
import { IError, IErrorResponse,  } from "../interfaces/error.interfaces";
import { handleZodError } from "../errorHelpers/handleZodError";
import AppError from "../errorHelpers/AppError";
import { deleteUploadedFilesFromGlobalErrorHandler } from "../utils/deleteUploadedFilesFromGlobalError";
import { Prisma } from "../../generated/prisma/client";
import { handlePrismaClientKnownRequestError, handlePrismaClientUnknownError, handlePrismaClientValidationError, handlerPrismaClientInitializationError, handlerPrismaClientRustPanicError } from "../errorHelpers/handlePrismaErrors";



// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
    if (env.NODE_ENV === 'development') {
        console.log("Error from Global Error Handler", err);
    }

    // if(req.file){
    //     await deleteFileFromCloudinary(req.file.path)
    // }

    // if(req.files && Array.isArray(req.files) && req.files.length > 0){
    //     const imageUrls = req.files.map((file) => file.path);
    //     await Promise.all(imageUrls.map(url => deleteFileFromCloudinary(url))); 
    // }
    await deleteUploadedFilesFromGlobalErrorHandler(req);

    let errorSource: IError[] = []
    let statusCode: number = status.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal Server Error';
    let stack: string | undefined = undefined;

    //Zod Error Patttern
    /*
     error.issues; 
    /* [
      {
        expected: 'string',
        code: 'invalid_type',
        path: [ 'username' , 'password' ], => username password
        message: 'Invalid input: expected string'
      },
      {
        expected: 'number',
        code: 'invalid_type',
        path: [ 'xp' ],
        message: 'Invalid input: expected number'
      }
    ] 
    */
if(err instanceof Prisma.PrismaClientKnownRequestError){
    const simplifiedError = handlePrismaClientKnownRequestError(err);
    statusCode = simplifiedError.statusCode as number
    message = simplifiedError.message
    errorSource = [...simplifiedError.errorSource]
    stack = err.stack;
} else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    const simplifiedError = handlePrismaClientUnknownError(err);
    statusCode = simplifiedError.statusCode as number
    message = simplifiedError.message
    errorSource = [...simplifiedError.errorSource]
    stack = err.stack;
}else if (err instanceof Prisma.PrismaClientValidationError) {
    const simplifiedError = handlePrismaClientValidationError(err);
    statusCode = simplifiedError.statusCode as number
    message = simplifiedError.message
    errorSource = [...simplifiedError.errorSource]
    stack = err.stack;
}else if (err instanceof Prisma.PrismaClientInitializationError) {
    const simplifiedError = handlerPrismaClientInitializationError(err);
    statusCode = simplifiedError.statusCode as number
    message = simplifiedError.message
    errorSource = [...simplifiedError.errorSource]
    stack = err.stack;
}else if (err instanceof Prisma.PrismaClientRustPanicError) {
    const simplifiedError = handlerPrismaClientRustPanicError();
    statusCode = simplifiedError.statusCode as number
    message = simplifiedError.message
    errorSource = [...simplifiedError.errorSource]
    stack = err.stack;

} else if (err instanceof z.ZodError) {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode as number
        message = simplifiedError.message
        errorSource = [...simplifiedError.errorSource]
        stack = err.stack;

    } else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        stack = err.stack;
        errorSource = [
            {
                path: '',
                message: err.message
            }
        ]
    }
    else if (err instanceof Error) {
        statusCode = status.INTERNAL_SERVER_ERROR;
        message = err.message
        stack = err.stack;
        errorSource = [
            {
                path: '',
                message: err.message
            }
        ]
    }


    const errorResponse: IErrorResponse = {
        success: false,
        message: message,
        errorSource,
        error: env.NODE_ENV === 'development' ? err : undefined,
        stack: env.NODE_ENV === 'development' ? stack : undefined,
    }

    res.status(statusCode).json(errorResponse);
    next();

}