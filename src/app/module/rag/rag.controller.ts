import { Request, Response } from "express"
import catchAsync from "../../shared/catchAsync"
import { sendResponse } from "../../shared/sendResponse"
import status from "http-status"
import { RAGService } from "./rag.service"


const ragService = new RAGService()

const getStats=async (req:Request,res:Response)=>{
    sendResponse(res,{
        httpStatus:status.OK,
        success:true,
        message:"rag stats",
        data:{}
    })
}

const ingestDoctors=catchAsync(async (req:Request,res:Response)=>{
    const result=await ragService.ingestDoctorData()
    
    sendResponse(res,{
        httpStatus:status.OK,
        success:true,
        message:"rag ingest doctors",
        data:result
    })
})

export const RagController = {
    getStats,
    ingestDoctors
}