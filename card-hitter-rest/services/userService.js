const db = require('../lib/db');
const userQueries = require('../lib/userQueries.json');

const createUser = ({id, username, password}, callback) => {
    db.query(userQueries.createUser, [id, username, password], (error, result) => {
        if(error) {
            throw error;
        }

        return callback(result);
    });
}

const findUserByUsername = (username, callback) => {
    db.query(userQueries.findByUsername, [username], (error, result) => {
        if(error) {
            throw error;
        }

        return callback(result);
    });
}

const updateLoginDate = (userId) => {
    db.query(userQueries.updateLoginDate, [userId], (error, result) => {
        if(error) {
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