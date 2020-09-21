
const checkUserGameId = (req, res, next) => {
    if (!req.params.userGameId) {
        return res.status(400).send({ msg: 'Pelin id puuttuu!' });
    }

    next();
}

module.exports = {
    checkUserGameId: checkUserGameId
}