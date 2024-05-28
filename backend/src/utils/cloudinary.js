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
        console.log("LocalFilePath = "+localfilepath);
        const uniqueSuffix = Date.now();
        var mainFolderName = "main"; 
    // filePathOnCloudinary: path of image we want 
    // to set when it is uploaded to cloudinary
    var filePathOnCloudinary =  mainFolderName + "/" + uniqueSuffix; 
        const uploadResult = await cloudinary.uploader.upload(localfilepath, {
            public_id: filePathOnCloudinary,
            resource_type:"auto",
            allowed_formats:['jpg','png','jpeg']
        }).catch((error)=>{console.log(error)});
        
        console.log("uploadResult = "+uploadResult.url);//uploadResult.url to get url of file path
        
        // Optimize delivery by resizing and applying auto-format and auto-quality
        const optimizeUrl = cloudinary.url("images", {
            fetch_format: 'auto',
            quality: 'auto'
        });
        
        console.log("optimizeUrl "+optimizeUrl);
        
        // Transform the image: auto-crop to square aspect_ratio
        const autoCropUrl = cloudinary.url("images", {
            crop: 'auto',
            gravity: 'auto',
            width: 500,
            height: 500,
        });
        
        console.log("autoCropUrl = "+autoCropUrl);
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
        return null; //return error  ---------------------------------Work has to be done
    }
}

export default uploadOnCloudinary;
