/**
 * @file
 * @author Joonatan Taajamaa
 */

const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

const db = require('../lib/db');
const userQueries = require('../lib/userQueries.json');
const userQueryHandler = require('../lib/userQueryHandler');

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

const findUserByUsername = (username, callback) => {
    db.query(userQueries.findByUsername, [username], (error, result) => {
        if (error) {
            throw error;
        }

        return callback(result);
    });
}

const updateLoginDate = (userId) => {
    db.query(userQueries.updateLoginDate, [userId], (error, result) => {
        if (error) {
            return error;
        }

        return true;
    });
}

module.exports = {
    createUser: createUser,
    logUserIn: logUserIn,
    findUserByUsername: findUserByUsername,
    updateLoginDate: updateLoginDate
}