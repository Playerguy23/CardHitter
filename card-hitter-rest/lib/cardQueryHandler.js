/**
 * @file
 * @author Joonatan Taajamaa
 */
const uuid = require('uuid');

const cardQueries = require('./cardQueries.json');

const db = require('./db');
const deckHandle = require('./deckHandle');

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

const findActiveById = (id, callback) => {
    db.query(cardQueries.findActiveById, [id], (error, result) => {
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

const countAllUserCards = (userGameId, callback) => {
    db.query(cardQueries.countPlayersCards, [userGameId], (error, result) => {
        if (error) {
            throw error;
        }

        return callback(result);
    });
}

const findForUserByUserGameIdOrderedByNumberInDesc = (userGameId, callback) => {
    db.query(cardQueries.findForUserByUserGameIdOrderedByNumberInDesc, [userGameId], (error, result) => {
        if (error) {
            throw error;
        }

        return callback(result);
    });
}

const findForEnemyByUserGameIdOrderedByNumberInDesc = (userGameId, callback) => {
    db.query(cardQueries.findForEnemyByUserGameIdOrderedByNumberInDesc, [userGameId], (error, result) => {
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

module.exports = {
    sendOne: sendOne,
    findById: findById,
    findActiveById: findActiveById,
    findByUserGameId: findByUserGameId,
    findAllPlayerCardsByUserCardOrderedByNumberInDesc: findAllPlayerCardsByUserCardOrderedByNumberInDesc,
    countAllUserCards: countAllUserCards,
    findForUserByUserGameIdOrderedByNumberInDesc: findForUserByUserGameIdOrderedByNumberInDesc,
    findForEnemyByUserGameIdOrderedByNumberInDesc: findForEnemyByUserGameIdOrderedByNumberInDesc,
    createCard: createCard,
    setAsPlayersCardByUserGameIdAndNumber: setAsPlayersCardByUserGameIdAndNumber,
    setAsEnemysCardByIdAndNumber: setAsEnemysCardByIdAndNumber,
    setOutOfGameById: setOutOfGameById
}