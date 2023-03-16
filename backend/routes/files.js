const express = require('express');
const fs = require('fs');
const path = require('path');
const { body } = require('express-validator');
const multer = require('multer');

const UPLOADS_DIR = path.join('uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

const router = express.Router();

// Define the validation rules
const uploadFileValidation = [
  body('file')
    .notEmpty()
    .withMessage('File is required'),
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const absolutePath = path.join('uploads/');
    cb(null, absolutePath);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}.${ext}`);
  },
});
const upload = multer({ storage });

router.get('/files', (req, res) => {
  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) {
      res.send({ files: [] });
      return;
    }

    const fileList = files.map((filename) => {
      const fileStats = fs.statSync(path.join(UPLOADS_DIR, filename));

      return {
        name: filename,
        url: `${process.env.NUXT_ENV_API_ENDPOINT_URL}/uploads/${filename}`,
        size: fileStats.size,
        lastModified: fileStats.birthtimeMs,
      };
    });
    res.send({ files: fileList });
  });
});

router.post('/upload', uploadFileValidation, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }

  const { originalname, size, lastModified } = req.file;

  const file = {
    name: originalname,
    url: `${process.env.NUXT_ENV_API_ENDPOINT_URL}/uploads/${originalname}`,
    size,
    lastModified: lastModified || new Date().getTime(),
  };

  res.send({ message: 'File uploaded successfully', file });
});

module.exports = router;
