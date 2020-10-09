const fetch = require('node-fetch');

const userCircleTestService = require('./userCircleTestService');
const baseUrl = require('../lib/baseUrl.json');

const createGame = (callback) => {
    userCircleTestService.userSignup((user, status) => {
        userCircleTestService.loginUser(user, (result, status) => {
            const token = result.token;
            const config = {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            fetch(`${baseUrl.url}/user/game/new`, config).then(response => {
                if (response.ok) {
                    response.json().then(result => {
                        const callObject = {
                            gameId: result.gameId,
                            token: token
                        };
                        return callback('success', callObject);
                    });
                } else {
                    response.json().then(result => {
                        return callback('fail', 'no object');
                    });
                }
            });
        });
    });
}

module.exports = {
    createGame: createGame
}