import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';


// Configuration
cloudinary.config({
    cloud_name: 'w87pjcmb',
    api_key: '816488668517153',
    api_secret: '<your_api_secret>' 
});


const uploadCloudinary = async (localFile) => {
    try {
        if(!localFile) return;
        // Upload an image/video stuff
        const uploadResult = await cloudinary.uploader
            .upload(localFile, {
                public_id: 'video/file',
                resource_type: "auto"
            })
            console.log("The File is Successfully uploaded on cloudinary : ",uploadResult.url )
    } catch (error) {
        fs.unlink(localFile)// remove the locally saved file as the upload opration got failed
        console.log(error);
    }
    return null    
};