import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync.js";
import { sendResponse } from "../../shared/sendResponse.js";
import { NewsService } from "./news.service.js";

const getPublishedNews = catchAsync(async (_req: Request, res: Response) => {
    const result = await NewsService.getPublishedNews();
    sendResponse(res, { httpStatus: status.OK, success: true, message: "News fetched successfully", data: result });
});

const getNewsBySlug = catchAsync(async (req: Request, res: Response) => {
    const result = await NewsService.getNewsBySlug(req.params.slug as string);
    sendResponse(res, { httpStatus: status.OK, success: true, message: "Article fetched successfully", data: result });
});

const getAllNews = catchAsync(async (_req: Request, res: Response) => {
    const result = await NewsService.getAllNews();
    sendResponse(res, { httpStatus: status.OK, success: true, message: "News fetched successfully", data: result });
});

const createNews = catchAsync(async (req: Request, res: Response) => {
    const result = await NewsService.createNews(req.body);
    sendResponse(res, { httpStatus: status.CREATED, success: true, message: "Article created successfully", data: result });
});

const updateNews = catchAsync(async (req: Request, res: Response) => {
    const result = await NewsService.updateNews(req.params.id as string, req.body);
    sendResponse(res, { httpStatus: status.OK, success: true, message: "Article updated successfully", data: result });
});

const deleteNews = catchAsync(async (req: Request, res: Response) => {
    const result = await NewsService.deleteNews(req.params.id as string);
    sendResponse(res, { httpStatus: status.OK, success: true, message: "Article deleted successfully", data: result });
});

export const NewsController = {
    getPublishedNews,
    getNewsBySlug,
    getAllNews,
    createNews,
    updateNews,
    deleteNews,
};
