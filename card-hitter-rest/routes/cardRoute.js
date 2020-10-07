/**
 * @file
 * @author Joonatan Taajamaa
 */

const express = require('express');
const router = express.Router();

const calculationService = require('../services/calculationService');
const deckHandler = require('../lib/deckHandle');
const cardService = require('../services/cardService');

const userMiddleware = require('../middleware/userMiddleware');
const cardMiddleware = require('../middleware/cardMiddleware');
const userGameQueryHandler = require('../lib/userGameQueryHandler');

router.put('/deck/:userGameId', userMiddleware.checkLogin, cardMiddleware.checkUserGameId, (req, res, next) => {
    const userGameId = req.params.userGameId;

    const deckStatus = {
        deckCreated: 0,
        deckAlreadyExists: 1
    };

    cardService.suffleCards(userGameId, (status) => {
        switch(status) {
            case deckStatus.deckCreated:
                return res.status(200).send({ msg: 'Deck created' });
            case  deckStatus.deckAlreadyExists:
                return res.status(400).send({ msg: 'Kortteja on jo pelillä' });
        }
    });
});

router.post('/player/pick/:userGameId', userMiddleware.checkLogin, cardMiddleware.checkUserGameId, (req, res, next) => {
    const userGameId = req.params.userGameId;

    cardService.findAllPlayerCardsByUserCardOrderedByNumberInDesc(userGameId, (result) => {
        if (result.length < 8) {
            cardService.findForUserByUserGameIdOrderedByNumberInDesc(userGameId, (resultA) => {
                if (resultA.length) {
                    cardService.setAsPlayersCardByUserGameIdAndNumber(resultA[0].id);
                    cardService.countAllUserCards(userGameId, (result) => {
                        const playerCardCount = result[0][`COUNT(*)`];

                        const response = {
                            result: resultA[0],
                            count: playerCardCount
                        };
                        return res.status(200).send(response);
                    });
                } else {
                    cardService.resetGame(userGameId);
                    userGameQueryHandler.setGameAsWon(userGameId);
                    return res.status(204).send({ msg: 'Korttipakka käytetty!' });
                }
            });
        } else {
            cardService.resetGame(userGameId);
            userGameQueryHandler.setGameAsLost(userGameId);

            return res.status(406).send({ msg: 'Käsi on täysi!' });
        }
    });

});

router.post('/enemy/pick/:userGameId', userMiddleware.checkLogin, cardMiddleware.checkUserGameId, (req, res, next) => {
    const userGameId = req.params.userGameId;

    cardService.findForEnemyByUserGameIdOrderedByNumberInDesc(userGameId, (result) => {
        if (result.length) {
            cardService.setAsEnemysCardByIdAndNumber(result[0].id);
            return res.status(200).send(result[0]);
        } else {
            return res.status(400).send({ msg: 'Korttipakka käytetty!' });
        }
    });
});

router.post('/out/:cardId', userMiddleware.checkLogin, cardMiddleware.checkCardId, (req, res, next) => {
    const cardId = req.params.cardId;

    cardService.setOutOfGameById(cardId);

    return res.status(200).send({ msg: 'Kortti poistettu pelistä!' });
});

router.post('/out', userMiddleware.checkLogin, cardMiddleware.checkEnemyAndPlayerCardId, (req, res, next) => {
    const userGameId = req.query.userGameId;
    const playerCardId = req.query.playerCardId;
    const enemyCardId = req.query.enemyCardId

    cardService.findActiveById(playerCardId, (resultA) => {
        cardService.findActiveById(enemyCardId, (resultB) => {
            if (resultA.length) {
                if (!resultB.length) {
                    return res.status(406).send({ msg: 'Et nostanut uutta korttia!' });
                }

                if (resultA[0].name === resultB[0].name) {
                    cardService.setOutOfGameById(playerCardId);
                    cardService.setOutOfGameById(enemyCardId);

                    cardService.countAllUserCards(userGameId, (result) => {
                        const playerCardCount = result[0][`COUNT(*)`];

                        const response = {
                            msg: 'Kortit poistettu pelistä!',
                            count: playerCardCount
                        };

                        return res.status(200).send(response);
                    });
                } else {
                    return res.status(400).send({ msg: 'Kortit eivät olleet samat.' });
                }
            } else {
                return res.status(404).send({ msg: 'Kortteja ei löytynyt!' });
            }
        });
    });
});

module.exports = router;