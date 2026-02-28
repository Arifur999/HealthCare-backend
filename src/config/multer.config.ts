import { CloudinaryStorage } from "multer-storage-cloudinary";
import { uploadToCloudinary } from "./cloudinary.config";
import multer from "multer";

const storage = new CloudinaryStorage({
    cloudinary: uploadToCloudinary,
    params:async (req, file) => {

        const originalName = file.originalname;
        const extension = originalName.split(".").pop()?.toLowerCase();
        const fileNameWithoutExtension = originalName
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


        return {
            folder : `healthcare/${folder}`,
            public_id:uniqName,
            resource_type: "auto",
        }
    }
      
    
});

export const multerUpload = multer({ storage });
