/**
 * @file
 * @author Joonatan Taajamaa
 */

const uuid = require('uuid');

const db = require('../lib/db');
const userInfoQueries = require('../lib/userInfoQueries.json');

const findByUserId = (userId, callback) => {
    db.query(userInfoQueries.findByUserId, [userId], (error, result) => {
        if (error) {
            throw error;
        }

        return callback(result);
    });
}

const findUsedCardsAmountByUserId = (userId, callback) => {
    db.query(userInfoQueries.findUsedCardsAmountByUserId, [userId], (error, result) => {
        if (error) {
            throw error;
        }

        return callback(result);
    });
}

const findAllActiveGamesByUserId = (userId, callback) => {
    db.query(userInfoQueries.findAllActiveGamesByUserId, [userId], (error, result) => {
        if (error) {
            throw error;
        }

        return callback(result);
    });
}

const createGame = (userId, callback) => {
    const newId = uuid.v4();

    db.query(userInfoQueries.createGame, [newId, userId], (error, result) => {
        if (error) {
            throw error;
        }

        return callback(result, newId);
    });
}

const setGameAsLost = (userId) => {
    db.query(userInfoQueries.setAsLost, [userId], (error, result) => {
        if (error) {
            throw error;
        }

        return true;
    });
}

module.exports = {
    findByUserId: findByUserId,
    createGame: createGame,
    findUsedCardsAmountByUserId: findUsedCardsAmountByUserId,
    findAllActiveGamesByUserId: findAllActiveGamesByUserId,
    setGameAsLost: setGameAsLost
}