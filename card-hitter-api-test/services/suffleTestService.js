const fetch = require('node-fetch');

const baseUrl = require('../lib/baseUrl.json')
const gameCreationTestService = require('./gameCreationTestService');

const suffle = (callback) => {
    gameCreationTestService.createGame((status, {gameId, token}) => {
        const config = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        fetch(`${baseUrl.url}/card/deck/${gameId}`, config).then(response => {
            if (response.ok) {
                response.json().then(result => {
                    return callback('success');
                });
            } else {
                response.json().then(result => {
                    return callback('fail');
                });
            }
        });
    });
}

module.exports = {
    suffle: suffle
}