/**
 * @file
 * @author Joonatan Taajamaa
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

const userMiddleware = require('../middleware/userMiddleware');

const userService = require('../services/userService');
const userInfoService = require('../services/userInfoService');
const calculationService = require('../services/calculationService');

router.put('/signup', userMiddleware.validateRegisteration, (req, res, next) => {

    const lowerUsername = req.body.username.toLowerCase();
    const password = req.body.password;

    userService.findUserByUsername(lowerUsername, (result) => {
        if (!result.length) {
            bcrypt.hash(password, 10, (error, hashedPassword) => {
                if (error) {
                    throw error;
                }

                const finalUser = {
                    username: lowerUsername,
                    password: hashedPassword
                }

                userService.createUser(finalUser, (result) => {
                    return res.status(200).send({ msg: 'Käyttäjä on rekisteröitynyt onnistuneesti. Odota hetki!' });
                });
            });
        } else {
            return res.status(400).send({ msg: 'Käyttäjänimi on jo käytössä!' });
        }
    });
});

router.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    userService.findUserByUsername(username, (result) => {
        if (result.length) {
            const userFromDatabase = result[0];

            bcrypt.compare(password, userFromDatabase.password, (error, result) => {
                if (error) {
                    return error;
                }

                if (result) {
                    const token = jsonwebtoken.sign({
                        userId: userFromDatabase.id
                    }, 'SECRET', {
                        expiresIn: '2h'
                    });

                    userService.updateLoginDate(userFromDatabase.id);

                    return res.status(200).send({ token: token });
                } else {
                    return res.status(401).send({ msg: 'Väärä salasana!' });
                }
            });
        } else {
            return res.status(401).send({ msg: 'Väärä käyttäjätunnus tai salasana!' });
        }
    });
});

router.put('/game/new', userMiddleware.checkLogin, (req, res, next) => {
    const userId = req.userData.userId;

    userInfoService.findAllActiveGamesByUserId(userId, (result) => {
        if (result.length) {
            userInfoService.setGameAsLost(userId);
        }

        userInfoService.createGame(userId, (result, id) => {
            return res.status(200).send({ msg: 'Peli luotu', gameId: id });
        });
    });
});

module.exports = router;