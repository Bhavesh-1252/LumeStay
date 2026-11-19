import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from 'cloudinary';

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Creating a Storage on the cloud
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'lumestay_DEV',
        allowedFormats: ["png", "jpeg", "webp"],
    },
});

// cloudinary.uploader.destroy("lumestay_DEV/lf4klhtfvbdvuyl4kusv").then((res) => { console.log(res) });

export {
    cloudinary,
    storage
}