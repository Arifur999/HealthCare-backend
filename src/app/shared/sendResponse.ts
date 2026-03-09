import { Response } from "express";

interface IResponseData <T> {
 httpStatus: number;
  success: boolean;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  message: string;
}

 export const sendResponse = <T>(res: Response, responseData: IResponseData<T>) => {
    const { httpStatus, success, data, message} = responseData;
  res.status(httpStatus).json({
    success,
    data,
    meta: responseData.meta,
    message,
  });
};

