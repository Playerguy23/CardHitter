/**
 * @file
 * @author Joonatan Taajamaa
 */

const fetch = require('node-fetch');
const baseUrl = require('../lib/baseUrl.json');

const sockets = (socket) => {
    socket.on('signup', (data) => {

        const config = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        fetch(`${baseUrl.url}/user/signup`, config).then(response => {
            if (response.ok) {
                response.json().then(result => {
                    const res = {
                        error: false,
                        result: result
                    };

                    socket.emit('signup', res);
                });
            } else {
                response.json().then(result => {
                    const res = {
                        error: true,
                        result: result
                    };

                    socket.emit('signup', res);
                });
            }

        });
    });

    socket.on('login', (data) => {
        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }

        fetch(`${baseUrl.url}/user/login`, config).then(response => {
            if (response.ok) {
                response.json().then(result => {
                    const res = {
                        error: false,
                        msg: 'Käyttäjän tietoja haetaan...',
                        result: result
                    };

                    socket.emit('login', res);
                });
            } else {
                response.json().then(result => {
                    const res = {
                        error: true,
                        result: result
                    };

                    socket.emit('login', res);
                });
            }
        });
    });
}

module.exports = sockets;