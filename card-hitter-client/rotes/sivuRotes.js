const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/home', (req, res) => {
    res.render('userhome');
});

router.get('/game', (req, res) => {
    res.render('game');
});

module.exports = router;