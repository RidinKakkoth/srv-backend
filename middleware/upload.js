import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'posts', 
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], 
  },
});


const upload = multer({ storage: storage });

export default upload;