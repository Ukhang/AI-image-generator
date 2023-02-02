const express = require('express');
const { OpenAiController } = require('../controllers/openaiController');
const router = express.Router();

router.post('/generateimage', OpenAiController.generateImage);

module.exports = router;