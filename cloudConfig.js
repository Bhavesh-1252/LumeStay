const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

// Creating a Storage on the cloud
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'lumestay_DEV',
        allowedFormats: ["png", "jgp", "jpeg"],
    },
});


module.exports = {
    cloudinary,
    storage
}