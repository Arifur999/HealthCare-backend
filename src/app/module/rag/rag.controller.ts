import { Request, Response } from "express";
import { RAGService } from "./rag.service";
import catchAsync from "../../shared/catchAsync";
import status from "http-status";
import { sendResponse } from "../../shared/sendResponse";


const ragService = new RAGService();

const getStats = catchAsync(async (req: Request, res: Response) => {
  const result = await ragService.getStats();

  sendResponse(res, {
    success: true,
    httpStatus: status.OK,
    message: "RAG stats retrieved successfully",
    data: result,
  });
});

const ingestDoctors = catchAsync(async (req: Request, res: Response) => {
  const result = await ragService.ingestDoctorsData();

  sendResponse(res, {
    success: true,
    httpStatus: status.OK,
    message: "Doctors data ingestion completed",
    data: result,
  });
});

const queryRag = catchAsync(async (req: Request, res: Response) => {
  const { query, limit, sourceType } = req.body;

  if (!query) {
    return sendResponse(res, {
      success: false,
      httpStatus: status.BAD_REQUEST,
      message: "Query is required",
    });
  }

  const result = await ragService.generateAnswer(
    query,
    limit ?? 5,
    sourceType,
    true,
  );

  sendResponse(res, {
    success: true,
    httpStatus: status.OK,
    message: "Answer generated successfully",
    data: result,
  });
});

export const RagController = {
  getStats,
  ingestDoctors,
  queryRag,
};