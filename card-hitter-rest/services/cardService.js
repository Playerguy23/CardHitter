/**
 * @file
 * @author Joonatan Taajamaa
 */
const deckHandle = require('../lib/deckHandle');
const cardQueryHandler = require('../lib/cardQueryHandler');
const userGameQueryHandler = require('../lib/userGameQueryHandler');

const resetGame = (userGameId) => {
    cardQueryHandler.findByUserGameId(userGameId, (result) => {
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
            cardQueryHandler.findForUserByUserGameIdOrderedByNumberInDesc(userGameId, (cardForPlayer) => {
                if (cardForPlayer) {
                    cardQueryHandler.setAsPlayersCardByUserGameIdAndNumber(cardForPlayer.id);
                    cardQueryHandler.countAllUserCards(userGameId, (count) => {
                        const response = {
                            result: cardForPlayer,
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

    cardQueryHandler.findForEnemyByUserGameIdOrderedByNumberInDesc(userGameId, (enemyCard) => {
        if (enemyCard) {
            cardQueryHandler.setAsEnemysCardByIdAndNumber(enemyCard.id);

            return callback(returnStatus.successPickup, enemyCard);
        } else {
            return callback(returnStatus.deckUsed, 'no card');
        }
    });
}

const playEnemyAndPlayerCard = ({ playerCardId, enemyCardId, userGameId }, callback) => {
    const returnStatus = {
        cardPlayedSuccessfully: 0,
        cardWhereNotPickedup: 1,
        cardsWhereNotSame: 2,
        cardsWhereNotFound: 3
    }

    cardQueryHandler.findActiveById(playerCardId, (playerCard) => {
        cardQueryHandler.findActiveById(enemyCardId, (enemyCard) => {
            if (playerCard) {
                if (!enemyCard) {
                    return callback(returnStatus.cardWhereNotPickedup, 'no details');;
                }

                if (playerCard.name === enemyCard.name) {
                    setCardOutOfGame(playerCardId);
                    setCardOutOfGame(enemyCardId);

                    cardQueryHandler.countAllUserCards(userGameId, (count) => {
                        
                        const response = {
                            msg: 'Kortit poistettu pelistä!',
                            count: count
                        };

                        return callback(returnStatus.cardPlayedSuccessfully, response);
                    });
                } else {
                    return callback(returnStatus.cardsWhereNotSame, 'no details');
                }
            } else {
                return callback(returnStatus.cardsWhereNotFound, 'no details');
            }
        });
    });
}

module.exports = {
    suffleCards: suffleCards,
    cardForPlayer: cardForPlayer,
    cardForEnemy: cardForEnemy,
    playEnemyAndPlayerCard: playEnemyAndPlayerCard,
    setCardOutOfGame: setCardOutOfGame,
    resetGame: resetGame
}