/**
 * @file
 * @author Joonatan Taajamaa
 */

const express = require('express');
const router = express.Router();

const calculationService = require('../services/calculationService');
const deckHandler = require('../lib/deckHandle');
const cardService = require('../services/cardService');
const gameService = require('../services/userGameService');

const userMiddleware = require('../middleware/userMiddleware');
const cardMiddleware = require('../middleware/cardMiddleware');
const userGameService = require('../services/userGameService');

router.get('/one', userMiddleware.checkLogin, (req, res, next) => {
    res.status(200).send(cardService.sendOne());
});

router.put('/cards-one/:userGameId', userMiddleware.checkLogin, cardMiddleware.checkUserGameId, (req, res, next) => {
    const card = deckHandler.provideOne();

    cardService.findByUserGameId(req.params.userGameId, (result) => {
        let newNumber = 1;

        if (result.length) {
            newNumber = calculationService.newCardNumber(result.length);
        }

        const cardDetails = {
            name: card.name,
            path: card.path,
            number: newNumber,
            userGameId: req.params.userGameId
        }

        if (cardDetails.number <= 40) {
            cardService.createCard(cardDetails, (result) => {
                return res.status(200).send({ msg: 'Card created!' });
            });
        } else {
            return res.status(405).send({ msg: 'Korttien määrä on 40.' });
        }
    });
});

router.put('/deck/:userGameId', userMiddleware.checkLogin, cardMiddleware.checkUserGameId, (req, res, next) => {
    const userGameId = req.params.userGameId;

    cardService.findByUserGameId(userGameId, (result) => {
        if (!result.length) {
            cardService.createDeck(userGameId);
            return res.status(200).send({ msg: 'Deck created' });
        } else {
            return res.status(400).send({ msg: 'Kortteja on jo pelillä' });
        }
    });
});

router.post('/player/pick/:userGameId', userMiddleware.checkLogin, cardMiddleware.checkUserGameId, (req, res, next) => {
    const userGameId = req.params.userGameId;

    cardService.findAllPlayerCardsByUserCardOrderedByNumberInDesc(userGameId, (result) => {
        if (result.length < 5) {
            cardService.findForUserByUserGameIdOrderedByNumberInDesc(userGameId, (result) => {
                if (result.length) {
                    cardService.setAsPlayersCardByUserGameIdAndNumber(result[0].id);
                    return res.status(200).send(result[0]);
                } else {
                    return res.status(400).send({ msg: 'Korttipakka käytetty!' });
                }
            });
        } else {
            cardService.resetGame(userGameId);
            userGameService.setGameAsLost(userGameId);

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
    const playerCardId = req.query.playerCardId;
    const enemyCardId = req.query.enemyCardId;

    cardService.findActiveById(playerCardId, (resultA) => {
        cardService.findActiveById(enemyCardId, (resultB) => {
            if (resultA.length && resultB.length) {
                if (resultA[0].name === resultB[0].name) {
                    cardService.setOutOfGameById(playerCardId);
                    cardService.setOutOfGameById(enemyCardId);

                    return res.status(200).send({ msg: 'Kortit poistettu pelistä!' });
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