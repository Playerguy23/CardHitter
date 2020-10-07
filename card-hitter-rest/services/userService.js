/**
 * @file
 * @author Joonatan Taajamaa
 */

const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

const userQueryHandler = require('../lib/userQueryHandler');
const userGameQueryHandler = require('../lib/userGameQueryHandler');
const cardService = require('./cardService');

const createUser = ({ username, password }, callback) => {
    const returnStatus = {
        registered: 0,
        nonRegistered: 1
    }

    userQueryHandler.findUserByUsername(username, (result) => {
        if (result.length) {
            return callback(returnStatus.nonRegistered);
        } else {
            bcrypt.hash(password, 10, (error, hashedPassword) => {
                if (error) {
                    throw error;
                }

                userQueryHandler.saveNewUser(username, hashedPassword);
                return callback(returnStatus.registered);
            });
        }
    });
}

const logUserIn = ({ username, password }, callback) => {
    const returnStatus = {
        loggedIn: 0,
        wrongPassword: 1,
        wrongUsernameAndPassword: 2
    }

    userQueryHandler.findUserByUsername(username, (result) => {
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

                    userQueryHandler.updateLoginDate(userFromDatabase.id);

                    return callback(returnStatus.loggedIn, token);
                } else {
                    return callback(returnStatus.wrongPassword, 'no token');
                }
            });
        } else {
            return callback(returnStatus.wrongUsernameAndPassword, 'no token');
        }
    });
}

const createNewGame = (userId, callback) => {
    userGameQueryHandler.findAllActiveGamesByUserId(userId, (result) => {
        if (result.length) {
            for (let i = 0; i < result.length; i++) {
                userGameQueryHandler.setGameAsLost(result[i].id);
            }

            for (let i = 0; i < result.length; i++) {
                cardService.resetGame(result[i].id);
            }
        }

        userGameQueryHandler.createGame(userId, (result, id) => {
            return callback(id);
        });
    });
}

module.exports = {
    createUser: createUser,
    logUserIn: logUserIn,
    createNewGame: createNewGame
}