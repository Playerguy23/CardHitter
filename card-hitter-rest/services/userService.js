/**
 * @file
 * @author Joonatan Taajamaa
 */

const uuid = require('uuid');
const bcrypt = require('bcryptjs');

const db = require('../lib/db');
const userQueries = require('../lib/userQueries.json');
const userQueryHandler = require('../lib/userQueryHandler');

const createUser = ({ username, password }, callback) => {
    const returnStatus = {
        registered: 0,
        nonRegistered: 1
    }

    userQueryHandler.findUserByUsername(username, (result) => {
        let status;
        if (result.length) {
            status = returnStatus.nonRegistered;
        } else {
            bcrypt.hash(password, 10, (error, hashedPassword) => {
                if (error) {
                    throw error;
                }

                userQueryHandler.saveNewUser(username, hashedPassword);
            });

            status = returnStatus.registered;
        }
        
        return callback(status);
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
    findUserByUsername: findUserByUsername,
    updateLoginDate: updateLoginDate
}