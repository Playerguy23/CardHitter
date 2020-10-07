/**
 * @file
 * @author Joonatan Taajamaa
 */

const express = require('express');
const router = express.Router();

const userMiddleware = require('../middleware/userMiddleware');

const userService = require('../services/userService');
const cardService = require('../services/cardService');
const userGameService = require('../services/userGameService');

router.put('/signup', userMiddleware.validateRegisteration, (req, res, next) => {
    const lowerUsername = req.body.username.toLowerCase();
    const password = req.body.password;

    const creationStatus = {
        registered: 0,
        nonRegistered: 1
    }

    const finalUser = {
        username: lowerUsername,
        password: password
    }

    userService.createUser(finalUser, (status) => {
        switch(status) {
            case creationStatus.registered:
                return res.status(200).send({ msg: 'Käyttäjä on rekisteröitynyt onnistuneesti. Odota hetki!' });
            case creationStatus.nonRegistered:
                return res.status(400).send({ msg: 'Käyttäjänimi on jo käytössä!' });
        }
    });
});

router.post('/login', (req, res, next) => {
    const username = req.body.username.toLowerCase();
    const password = req.body.password;

    const loginStatus = {
        loggedIn: 0,
        wrongPassword: 1,
        wrongUsernameAndPassword: 2
    }

    const requestUser = {
        username: username,
        password: password
    };

    userService.logUserIn(requestUser, (status, token) => {
        switch(status) {
            case loginStatus.loggedIn:
                return res.status(200).send({ token: token });
            case loginStatus.wrongPassword:
                return res.status(401).send({ msg: 'Väärä salasana!' });
            case loginStatus.wrongUsernameAndPassword:
                return res.status(401).send({ msg: 'Väärä käyttäjätunnus tai salasana!' });
        }
    });
});

router.put('/game/new', userMiddleware.checkLogin, (req, res, next) => {
    const userId = req.userData.userId;

    userGameService.findAllActiveGamesByUserId(userId, (result) => {
        if (result.length) {
            for (let i = 0; i < result.length; i++) {
                userGameService.setGameAsLost(result[i].id);
            }

            for (let i = 0; i < result.length; i++) {
                cardService.resetGame(result[i].id);
            }
        }

        userGameService.createGame(userId, (result, id) => {
            return res.status(200).send({ msg: 'Peli luotu', gameId: id });
        });
    });
});

module.exports = router;