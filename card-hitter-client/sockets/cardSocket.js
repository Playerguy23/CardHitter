const { response } = require('express');
const { token } = require('morgan');
/**
 * @file
 * @author Joonatan Taajamaa
 */

const fetch = require('node-fetch');
const baseUrl = require('../lib/baseUrl.json');

const sockets = (socket) => {

    socket.on('suffle', ({ token, userGameId }) => {
        const config = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        fetch(`${baseUrl.url}/card/deck/${userGameId}`, config).then(response => {
            if (response.ok) {
                response.json().then(result => {
                    const data = {
                        error: false
                    };
                    socket.emit('suffle', data);
                });
            } else {
                response.json().then(result => {
                    const data = {
                        error: true,
                        result: result
                    };

                    socket.emit('suffle', data);
                });
            }
        });
    });

    socket.on('enemyPick', ({ token, userGameId }) => {
        const config = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        fetch(`${baseUrl.url}/card/enemy/pick/${userGameId}`, config).then(response => {
            if (response.ok) {
                response.json().then(result => {
                    const data = {
                        error: false,
                        result: result
                    };

                    socket.emit('enemyPick', data);
                });
            } else {
                response.json().then(result => {
                    const data = {
                        error: true,
                        result: result
                    };

                    socket.emit('enemyPick', data);
                });
            }
        });
    });

    socket.on('pickCard', ({ token, userGameId }) => {
        const config = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        fetch(`${baseUrl.url}/card/player/pick/${userGameId}`, config).then(response => {
            if (response.ok) {
                response.json().then(result => {
                    const data = {
                        error: false,
                        result: result
                    };

                    socket.emit('pickCard', data);
                });
            } else {
                response.json().then(result => {
                    const data = {
                        error: true,
                        result: result
                    };
                    socket.emit('pickCard', data);
                });
            }
        });
    });

    socket.on('playCard', ({ token, playerCard, enemyCard }) => {
        const config = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        fetch(`${baseUrl.url}/card/out?playerCardId=${playerCard.id}&enemyCardId=${enemyCard.id}`, config)
            .then(response => {
                if (response.ok) {
                    response.json().then(result => {
                        const data = {
                            error: false
                        };

                        socket.emit('playCard', data);
                    });
                } else {
                    response.json().then(result => {
                        const data = {
                            error: true,
                            result: result
                        };

                        socket.emit('playCard', data);
                    });
                }
            });
    });
}

module.exports = sockets;