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
}

module.exports = sockets;