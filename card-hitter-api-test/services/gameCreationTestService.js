const fetch = require('node-fetch');

const userCircleTestService = require('./userCircleTestService');
const baseUrl = require('../lib/baseUrl.json');

const createGame = (callback) => {
    userCircleTestService.userSignup((user, status) => {
        userCircleTestService.loginUser(user, (result, status) => {
            const config = {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${result.token}`
                }
            };

            fetch(`${baseUrl.url}/user/game/new`, config).then(response => {
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
    });
}

module.exports = {
    createGame: createGame
}