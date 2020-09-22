
const checkUserGameId = (req, res, next) => {
    if (!req.params.userGameId) {
        return res.status(400).send({ msg: 'Pelin id puuttuu!' });
    }

    next();
}

const checkCardId = (req, res, next) => {
    if (!req.params.cardId) {
        return res.status(400).send({ msg: 'Kortin id puuttuu!' });
    }

    next();
}

module.exports = {
    checkUserGameId: checkUserGameId,
    checkCardId: checkCardId
}