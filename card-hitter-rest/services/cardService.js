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

const createDeck = (userGameId) => {
    const cardData = deckHandle.provideDeck();
    for (let i = 1; i <= cardData.size; i++) {
        const details = {
            name: cardData.cards[i - 1].name,
            path: cardData.cards[i - 1].path,
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
    findForUserByUserGameIdOrderedByNumberInDesc: findForUserByUserGameIdOrderedByNumberInDesc,
    findForEnemyByUserGameIdOrderedByNumberInDesc: findForEnemyByUserGameIdOrderedByNumberInDesc,
    findById: findById,
    countAllUserCards: countAllUserCards,
    findActiveById: findActiveById,
    setOutOfGameById: setOutOfGameById,
    setAsEnemysCardByIdAndNumber: setAsEnemysCardByIdAndNumber,
    resetGame: resetGame
}