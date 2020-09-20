/**
 * @file
 * @author Joonatan Taajamaa
 */

const fetch = require('node-fetch');
const baseUrl = require('../lib/baseUrl.json');

const sockets = (socket) => {

    socket.on('pickCard', (token) => {
        const config = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        fetch(`${baseUrl.url}/card/one`, config).then(response => {
            if (response.ok) {
                response.json().then(result => {
                    const data = {
                        error: false,
                        result: result
                    };
                    socket.emit('pickCard', data);
                });
            } else {
                const data = {
                    error: true
                };
                socket.emit('pickCard', data);
            }
        });
    });

}

module.exports = sockets;