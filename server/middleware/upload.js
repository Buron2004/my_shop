const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'my-ecommerce',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
  },
});

const upload = multer({ storage });

module.exports = upload;