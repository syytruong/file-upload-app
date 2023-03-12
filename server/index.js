const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const app = express();
const path = require('path');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { body } = require('express-validator');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'jwt-secret123';
const USERS = [
  {
    id: '1234567890',
    name: 'John Doe',
    iat: Math.floor(Date.now() / 1000) - 30,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30), // 1 month valid
  }
];

// const token = jwt.sign(USERS[0], JWT_SECRET);
// console.log(token);

const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Define the JWT options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

// Define the JWT strategy
passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    // Find the user based on the payload

    // TODO: connect with DB later
    // const user = await User.findById(payload.sub);
    const user = USERS.find(u => u.id === payload.id);

    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
// Use the Passport.js middleware to authenticate requests
app.use(passport.initialize());
app.use(passport.authenticate('jwt', { session: false }));
// Use the Helmet.js middleware to set HTTP headers
app.use(helmet());

// Define the validation rules
const uploadFileValidation = [
  body('file')
    .notEmpty()
    .withMessage('File is required'),
];

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

app.post('/upload', uploadFileValidation, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }

  const { originalname, size, lastModified } = req.file;

  const file = {
    name: originalname,
    url: `http://localhost:5001/uploads/${originalname}`,
    size,
    lastModified: lastModified ? lastModified : new Date().getTime(),
  };

  res.send({ message: 'File uploaded successfully', file });
});

app.get('/files', passport.authenticate('jwt', { session: false }), (req, res) => {
  // check user role or permissions
  if (!req.user) {
    return res.status(403).send({ message: 'You do not have permission to access this resource' });
  }

  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Failed to read uploads directory' });
      return;
    }

    const fileList = files.map((filename) => {
      const fileStats = fs.statSync(path.join(UPLOADS_DIR, filename));

      return {
        name: filename,
        url: `http://localhost:5001/uploads/${filename}`,
        size: fileStats.size,
        lastModified: fileStats.birthtimeMs,
      };
    });
    res.send({ files: fileList });
  });
});

app.listen(5001, () => {
  console.log('Server listening on port 5001');
});
