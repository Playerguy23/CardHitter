/**
 * @file
 * @author Joonatan Taajamaa
 */

const uuid = require('uuid');

const db = require('../lib/db');
const userGameQueries = require('../lib/userGameQueries.json');

const findByUserId = (userId, callback) => {
    db.query(userGameQueries.findByUserId, [userId], (error, result) => {
        if (error) {
            throw error;
        }

        return callback(result);
    });
}

const findUsedCardsAmountByUserId = (userId, callback) => {
    db.query(userGameQueries.findUsedCardsAmountByUserId, [userId], (error, result) => {
        if (error) {
            throw error;
        }

        return callback(result);
    });
}

const findAllActiveGamesByUserId = (userId, callback) => {
    db.query(userGameQueries.findAllActiveGamesByUserId, [userId], (error, result) => {
        if (error) {
            throw error;
        }

        return callback(result);
    });
}

const createGame = (userId, callback) => {
    const newId = uuid.v4();

    db.query(userGameQueries.createGame, [newId, userId], (error, result) => {
        if (error) {
            throw error;
        }

        return callback(result, newId);
    });
}

const setGameAsLost = (id) => {
    db.query(userGameQueries.setAsLost, [id], (error, result) => {
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