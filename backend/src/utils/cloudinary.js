import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


    // Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload an image
const uploadOnCloudinary = async (localfilepath)=>{
    try {
        if(!localfilepath)return null; //if local file path is null return error ---------------------------------Work has to be done
        // console.log("LocalFilePath = "+localfilepath);
        const uniqueSuffix = Date.now();
        var mainFolderName = "main"; 
    // filePathOnCloudinary: path of image we want 
    // to set when it is uploaded to cloudinary
    var filePathOnCloudinary =  mainFolderName + "/" + uniqueSuffix; 
        const uploadResult = await cloudinary.uploader.upload(localfilepath, {
            public_id: filePathOnCloudinary,
            resource_type:"auto",
            allowed_formats:['jpg','png','jpeg']
        }).catch((error)=>{
            throw new Error(error.message);
        });
        
        fs.unlinkSync(localfilepath, (err) => {
            if (err) {
                console.error("Failed to delete local file:", err);
            } else {
                console.log("Successfully deleted local file:", localfilepath);
            }
        });
        return uploadResult.url;
    } 
    catch (error) {
        fs.unlinkSync(localfilepath);   //remove the locally saved file as the operate operation has failed
        // console.log("Inside Cloudinary ",error);
        throw error; //return error  ---------------------------------Work has to be done
        return error;
    }
}

export default uploadOnCloudinary;
