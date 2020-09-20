/**
 * @file
 * @author Joonatan Taajamaa
 */

const jsonwebtoken = require('jsonwebtoken');

const validateRegisteration = (req, res, next) => {
    if (!req.body.username || (req.body.username.length < 1)) {
        return res.status(400).send({ msg: 'Käyttäjänimen pituus on oltava suurempi kuin 0.' });
    }

    if(!req.body.password || (req.body.password.length < 8)) {
        return res.status(400).send({ msg: 'Salasanan pituus on oltava suurempi kuin 8.' });
    }

    next();
}

const checkLogin = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const decoded = jsonwebtoken.verify(token, 'SECRET');
        req.userData = decoded;

        next();
    } catch (error) {
        return res.status(401).send({ msg: 'Kirjautuminen sulkeutunut!' });
    }
}

module.exports = {
    validateRegisteration: validateRegisteration,
    checkLogin: checkLogin
}