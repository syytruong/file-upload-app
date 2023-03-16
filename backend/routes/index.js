const express = require('express');

const files = require('./files');

const router = express.Router();

router.use('/', files);

module.exports = router;
