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
                        error: false,
                        result: result
                    };

                    socket.emit('suffle', data);
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

}

module.exports = sockets;