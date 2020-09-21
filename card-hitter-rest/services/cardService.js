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

const findByUserGameId = (userGameId, callback) => {
    db.query(cardQueries.findByUserGameId, [userGameId], (error, result) => {
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


module.exports = {
    sendOne: sendOne,
    findByUserGameId: findByUserGameId,
    createCard: createCard
}