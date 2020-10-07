/**
 * @file
 * @author Joonatan Taajamaa
 */
const uuid = require('uuid');

const cardQueries = require('../lib/cardQueries.json');

const db = require('../lib/db');
const deckHandle = require('../lib/deckHandle');
const cardQueryHandler = require('../lib/cardQueryHandler');
const userGameQueryHandler = require('../lib/userGameQueryHandler');

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

const resetGame = (userGameId) => {
    findByUserGameId(userGameId, (result) => {
        if (result.length) {
            for (let i = 0; i < result.length; i++) {
                cardQueryHandler.setOutOfGameById(result[i].id);
            }
        }
    });
}

const suffleCards = (userGameId, callback) => {
    const returnStatus = {
        deckCreated: 0,
        deckAlreadyExists: 1
    };

    cardQueryHandler.findByUserGameId(userGameId, (result) => {
        if (!result.length) {
            const cardData = deckHandle.provideDeck();
            for (let i = 1; i <= cardData.size; i++) {
                const details = {
                    name: cardData.cards[i - 1].name,
                    path: cardData.cards[i - 1].path,
                    number: i,
                    userGameId: userGameId
                };

                cardQueryHandler.createCard(details, (result) => { return true; });
            }

            return callback(returnStatus.deckCreated);
        } else {
            return callback(returnStatus.deckAlreadyExists);
        }
    });
}

const setCardOutOfGame = (id) => {
    cardQueryHandler.setOutOfGameById(id);
    return;
}

const cardForPlayer = (userGameId, callback) => {
    const returnStatus = {
        successPickup: 0,
        deckUsed: 1,
        handIsFull: 2
    };

    cardQueryHandler.findAllPlayerCardsByUserCardOrderedByNumberInDesc(userGameId, (result) => {
        if (result.length < 8) {
            cardQueryHandler.findForUserByUserGameIdOrderedByNumberInDesc(userGameId, (resultA) => {
                if (resultA.length) {
                    cardQueryHandler.setAsPlayersCardByUserGameIdAndNumber(resultA[0].id);
                    cardQueryHandler.countAllUserCards(userGameId, (count) => {
                        const response = {
                            result: resultA[0],
                            count: count
                        };

                        return callback(returnStatus.successPickup, response);
                    });
                } else {
                    resetGame(userGameId);
                    userGameQueryHandler.setGameAsWon(userGameId);
                    return callback(returnStatus.deckUsed, 'no card');
                }
            });
        } else {
            resetGame(userGameId);
            userGameQueryHandler.setGameAsLost(userGameId);

            return callback(returnStatus.handIsFull, 'no card');
        }
    });
}

const cardForEnemy = (userGameId, callback) => {
    const returnStatus = {
        successPickup: 0,
        deckUsed: 1,
    }

    cardQueryHandler.findForEnemyByUserGameIdOrderedByNumberInDesc(userGameId, (result) => {
        if (result.length) {
            cardQueryHandler.setAsEnemysCardByIdAndNumber(result[0].id);

            return callback(returnStatus.successPickup, result[0]);
        } else {
            return callback(returnStatus.deckUsed, 'no card');
        }
    });
}

module.exports = {
    sendOne: sendOne,
    findByUserGameId: findByUserGameId,
    createCard: createCard,
    suffleCards: suffleCards,
    cardForPlayer: cardForPlayer,
    cardForEnemy: cardForEnemy,
    setAsPlayersCardByUserGameIdAndNumber: setAsPlayersCardByUserGameIdAndNumber,
    findAllPlayerCardsByUserCardOrderedByNumberInDesc: findAllPlayerCardsByUserCardOrderedByNumberInDesc,
    findForUserByUserGameIdOrderedByNumberInDesc: findForUserByUserGameIdOrderedByNumberInDesc,
    findForEnemyByUserGameIdOrderedByNumberInDesc: findForEnemyByUserGameIdOrderedByNumberInDesc,
    findById: findById,
    countAllUserCards: countAllUserCards,
    findActiveById: findActiveById,
    setCardOutOfGame: setCardOutOfGame,
    setAsEnemysCardByIdAndNumber: setAsEnemysCardByIdAndNumber,
    resetGame: resetGame
}