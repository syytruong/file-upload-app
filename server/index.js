const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const absolutePath = path.join(__dirname, 'uploads/');
    cb(null, absolutePath);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, Date.now() + '.' + ext);
  }
});
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  res.send({ message: 'File uploaded successfully' });
});

app.listen(5001, () => {
  console.log('Server listening on port 5001');
});
