import z from "zod";
import { IErrorResponse } from "../interfaces/error.interfaces";
import status from "http-status";

export const handleZodError = (err:z.ZodError):IErrorResponse => {
    const statusCode = status.BAD_REQUEST;
 const message = "Validation failed";
const errorSource : IErrorResponse['errorSource'] = [];
err.issues.forEach((issue) => {

  errorSource.push({
    path:issue.path.length>1? issue.path.join('=>'): issue.path[0].toString(),
    message: issue.message,
  });
});


return {
    success: false,
    message: message,
    statusCode: statusCode,
    errorSource: errorSource,
    error: err,
  }

}