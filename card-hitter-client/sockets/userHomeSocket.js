/**
 * @file
 * @author Joonatan Taajamaa
 */

const fetch = require('node-fetch');
const baseUrl = require('../lib/baseUrl.json');

const sockets = (socket) => {
    socket.on('startGame', (token) => {
        const config = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        fetch(`${baseUrl.url}/user/game/new`, config).then(response => {
            if (response.ok) {
                response.json().then(result => {
                    const data = {
                        error: false,
                        id: result.id
                    };

                    socket.emit('startGame', data);
                });
            } else {
                response.json().then(result => {
                    const data = {
                        error: true
                    };

                    socket.emit('startGame', data);
                });
            }
        }).catch(error => {
            const data = {
                error: true
            };

            socket.emit('startGame', data);
        });
    });
}

module.exports = sockets;