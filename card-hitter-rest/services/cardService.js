/**
 * @file
 * @author Joonatan Taajamaa
 */
const uuid = require('uuid');

const cardQueries = require('../lib/cardQueries.json');

const db = require('../lib/db');
const deckHandle = require('../lib/deckHandle');

const sendOne = () => {
    return deckHandle.provideOne();
}

const findById = (id, callback) => {
    db.query(cardQueries.findById, [id], (error, result) => {
        if (error) {
            throw error;
        }

        return callback(result);
    });
}

const findByUserGameId = (userGameId, callback) => {
    db.query(cardQueries.findByUserGameId, [userGameId], (error, result) => {
        if (error) {
            throw error;
        }

        return callback(result);
    });
}

const findAllPlayerCardsByUserCardOrderedByNumberInDesc = (userGameId, callback) => {
    db.query(cardQueries.findAllPlayerCardsByUserCardOrderedByNumberInDesc, [userGameId], (error, result) => {
        if (error) {
            throw error;
        }

        return callback(result);
    });
}

const findForGameByUserGameIdOrderedByNumberInDesc = (userGameId, callback) => {
    db.query(cardQueries.findForGameByUserGameIdOrderedByNumberInDesc, [userGameId], (error, result) => {
        if (error) {
            throw error;
        }

        return callback(result);
    });
}

const createCard = ({ name, path, number, userGameId }, callback) => {
    const newId = uuid.v4();

    db.query(cardQueries.createCard, [newId, name, path, number, userGameId], (error, result) => {
        if (error) {
            throw error;
        }

        return callback(result);
    });
}

const setAsPlayersCardByUserGameIdAndNumber = (id) => {
    db.query(cardQueries.setAsPlayersCardByIdAndNumber, [id], (error, result) => {
        if (error) {
            throw error;
        }

        return true;
    });
}

const setAsEnemysCardByIdAndNumber = (id) => {
    db.query(cardQueries.setAsEnemysCardByIdAndNumber, [id], (error, result) => {
        if (error) {
            throw error;
        }

        return true;
    });
}

const setOutOfGameById = (id) => {
    db.query(cardQueries.setOutOfGameById, [id], (error, result) => {
        if (error) {
            throw error;
        }

        return true;
    });
}

const createDeck = (userGameId) => {
    for (let i = 1; i <= 40; i++) {
        const card = deckHandle.provideOne();

        const details = {
            name: card.name,
            path: card.path,
            number: i,
            userGameId: userGameId
        };

        createCard(details, (result) => {
            return true;
        });
    }
}

const resetGame = (userGameId) => {

    findByUserGameId(userGameId, (result) => {
        if (result.length) {
            for (let i = 0; i < result.length; i++) {
                db.query(cardQueries.setOutOfGameById, [result[i].id], (error, result) => {
                    if (error) {
                        throw error;
                    }

                    return true;
                });
            }
        }
    });
}

module.exports = {
    sendOne: sendOne,
    findByUserGameId: findByUserGameId,
    createCard: createCard,
    createDeck: createDeck,
    setAsPlayersCardByUserGameIdAndNumber: setAsPlayersCardByUserGameIdAndNumber,
    findAllPlayerCardsByUserCardOrderedByNumberInDesc: findAllPlayerCardsByUserCardOrderedByNumberInDesc,
    findForGameByUserGameIdOrderedByNumberInDesc: findForGameByUserGameIdOrderedByNumberInDesc,
    findById: findById,
    setOutOfGameById: setOutOfGameById,
    setAsEnemysCardByIdAndNumber: setAsEnemysCardByIdAndNumber,
    resetGame: resetGame
}