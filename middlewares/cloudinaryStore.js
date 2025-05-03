const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const cloudinaryConfig = require('../utils/cloudinaryConfig');
const e = require('express');
cloudinaryConfig(cloudinary);

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'coverPhoto') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for cover photos!'), false);
    }
  } else if (file.fieldname === 'introVideo') {
    const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid video format! Please upload MP4, WebM, or OGG video.'), false);
    }
  } else if (file.fieldname === 'image') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for posts!'), false);
    }
  } else {
    cb(new Error('Unknown field name!'), false);
  }
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => {
      if (file.fieldname === 'coverPhoto') return 'novel-hub/novelcovers';
      if (file.fieldname === 'introVideo') return 'novel-hub/introduction-videos';
      return 'novel-hub/posts';
    },
    public_id: () => uuidv4(),
    resource_type: (req, file) => 
      file.fieldname === 'introVideo' ? 'video' : 'image',
    format: (req, file) => file.mimetype.split('/')[1],
    transformation: (req, file) => {
      if (file.fieldname === 'coverPhoto') {
        return [
          { height: 600, width: 400 },
          { quality: 'auto' }
        ];
      }
      if (file.fieldname === 'image') {
        return [
          { height: 1080, width: 1920 },
          { quality: 'auto' }
        ];
      }
      return [{ quality: 'auto' }];
    }
  }
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: (req, file) => {
      if (file.fieldname === 'introVideo') {
        return 50 * 1024 * 1024; // 50MB for videos
      }
      return 5 * 1024 * 1024; // 5MB for other files
    }
  }
});

module.exports = upload;
