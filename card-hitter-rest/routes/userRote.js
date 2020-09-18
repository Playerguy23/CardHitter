const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

const userMiddleware = require('../middleware/userMiddleware');
const userService = require('../services/userService');

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
                    id: uuid.v4(),
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
                        userId: userFromDatabase.id,
                        role: userFromDatabase.role
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



module.exports = router;