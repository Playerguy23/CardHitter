/**
 * @file
 * @author Joonatan Taajamaa
 */

const express = require('express');
const router = express.Router();

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

    const pickupStatus = {
        successPickup: 0,
        deckUsed: 1,
        handIsFull: 2
    };

    cardService.cardForPlayer(userGameId, (status, cardDetails) => {
        switch(status) {
            case pickupStatus.successPickup:
                return res.status(200).send(cardDetails);
            case pickupStatus.deckUsed:
                return res.status(204).send({ msg: 'Korttipakka käytetty!' });
            case pickupStatus.handIsFull:
                return res.status(406).send({ msg: 'Käsi on täysi!' });
        }
    });
});

router.post('/enemy/pick/:userGameId', userMiddleware.checkLogin, cardMiddleware.checkUserGameId, (req, res, next) => {
    const userGameId = req.params.userGameId;

    const pickupStatus = {
        successPickup: 0,
        deckUsed: 1,
    }

    cardService.cardForEnemy(userGameId, (status, card) => {
        switch(status) {
            case pickupStatus.successPickup:
                return res.status(200).send(card);
            case pickupStatus.deckUsed:
                return res.status(400).send({ msg: 'Korttipakka käytetty!' });  
        }
    });
});

router.post('/out/:cardId', userMiddleware.checkLogin, cardMiddleware.checkCardId, (req, res, next) => {
    const cardId = req.params.cardId;

    cardService.setCardOutOfGame(cardId);

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
                    cardService.setCardOutOfGame(playerCardId);
                    cardService.setCardOutOfGame(enemyCardId);

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