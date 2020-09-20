/**
 * @file
 * @author Joonatan Taajamaa
 */

const express = require('express');
const router = express.Router();

const cardService = require('../services/cardService');
const userMiddleware = require('../middleware/userMiddleware');

router.get('/one', userMiddleware.checkLogin, (req, res, next) => {
    res.status(200).send(cardService.sendOne());
});

module.exports = router;