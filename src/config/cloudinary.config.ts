import {v2 as cloudinary} from "cloudinary"
import { env } from "./env";
import AppError from "../app/errorHelpers/AppError";
import status from "http-status";

cloudinary.config({
    cloud_name:env.CLOUDINARY_CLOUD_NAME,
    api_key:env.CLOUDINARY_API_KEY,
    api_secret:env.CLOUDINARY_API_SECRET,
    
})

export const deleteFileFromCloudinary = async (url: string) =>{
    try {
   const regex=/\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);
    if(match){
        const publicId = match[1];

        await cloudinary.uploader.destroy(
            publicId,{
                resource_type:"image",
               
            }

        );
       
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error : any){
        console.log(error);
        throw new AppError(status.INTERNAL_SERVER_ERROR,"Failed to delete file from cloudinary")
    }

        
}

export const uploadToCloudinary = cloudinary;