/**
 * @file
 * @author Joonatan Taajamaa
 */

const uuid = require('uuid');

const db = require('../lib/db');
const userQueries = require('../lib/userQueries.json');

const createUser = ({ username, password }, callback) => {
    const newId = uuid.v4();

    db.query(userQueries.createUser, [newId, username, password], (error, result) => {
        if (error) {
            throw error;
        }

        return callback(result);
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