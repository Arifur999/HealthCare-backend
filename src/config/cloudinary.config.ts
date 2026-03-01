import {v2 as cloudinary, UploadApiResponse} from "cloudinary"
import { env } from "./env";
import AppError from "../app/errorHelpers/AppError";
import status from "http-status";

cloudinary.config({
    cloud_name:env.CLOUDINARY_CLOUD_NAME,
    api_key:env.CLOUDINARY_API_KEY,
    api_secret:env.CLOUDINARY_API_SECRET,
    
})

export const uploadFileToCloudinary = async (buffer: Buffer, fileName: string):Promise<UploadApiResponse>=> {
    try {

if(!buffer || !fileName){
    throw new AppError(status.BAD_REQUEST,"Invalid file data")
}


        const extension = fileName.split(".").pop()?.toLowerCase();
        const fileNameWithoutExtension = fileName
        .split(".")
        .slice(0, -1)
        .join(".")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-]/g, "")
        .replace(/^-+|-+$/g, "");

        const uniqName=
        Math.random().toString(36).substring(2)+
        "-"+
        Date.now()+
        "-"+
        fileNameWithoutExtension;
        
        
        const folder=extension==="pdf" ? "pdfs" : "images";


        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: `healthcare/${folder}`,
                    public_id:uniqName,
                    resource_type: "auto",
                },
                (error, result) => {
                    if (error) {
                        return reject(new AppError(status.INTERNAL_SERVER_ERROR, "Failed to upload file to cloudinary"))
                    } else {
                        resolve(result as UploadApiResponse);
                    }
                }
            ).end(buffer);
        })
            
                

    } catch (error) {
        console.log(error);
        throw new AppError(status.INTERNAL_SERVER_ERROR,"Failed to upload file to cloudinary")

    }
}



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